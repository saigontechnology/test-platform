'use client';

import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CustomModal, {
  CustomModalHandler,
} from '../components/molecules/CustomModal';
import Header from '../components/organisms/Header';
import { IAssessment, IQuestion } from '../constants/assessments';
import ApiHook, { Methods } from '../lib/apis/ApiHook';
import AssessmentQuestion from './(components)/assessmentQuestion';
import CountdownTimer from './(components)/countdownTimer';
import ExaminationInfo from './(components)/examInformation';

interface IExamAnswerPayload {
  questionId: number;
  selections: number[];
}

const ExaminationPage = () => {
  const [assessmentInfo, setAssessmentInfo] = useState<IAssessment>();
  const [assessments, setAssessments] = useState<IQuestion[]>([]);
  const [currentAssId, setCurrentAssId] = useState<number>(0);
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number[]>>();
  const confirmModalRef = useRef<CustomModalHandler>(null);

  useEffect(() => {
    if (sessionStorage.getItem('reloaded')) {
      router.push('/');
    } else {
      (async () => {
        const res: { data: IAssessment } = await ApiHook(
          Methods.GET,
          '/assessments/2',
        );
        if (res.data.assessmentQuestionMapping.length) {
          setAssessmentInfo(res.data);
          setAssessments(res.data.assessmentQuestionMapping);
          setCurrentAssId(res.data.assessmentQuestionMapping[0].question.id);
        } else {
          // TODO:
        }
      })();
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      sessionStorage.setItem('reloaded', (+new Date()).toString(36));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const Handlers = {
    handleSubmit: async (finalAnswers: IExamAnswerPayload[]) => {
      const payload = {
        email: sessionStorage.getItem('candidateEmail'),
        assessmentId: assessmentInfo?.id,
        selections: finalAnswers,
      };
      const { error } = await ApiHook(Methods.POST, '/examinations', {
        data: payload,
      });
      if (!error) {
        router.push('/');
      } else {
        alert('Examination submit got error');
      }
    },
    handleNext: ({
      currId,
      answers: currentAnswers,
    }: {
      currId: number;
      answers: number[];
    }) => {
      const currIndex = assessments.findIndex(
        (ass) => ass.question.id === currId,
      );
      if (currIndex > -1) {
        const newAnswers = { ...answers, [currId]: currentAnswers };
        setAnswers(newAnswers);
        const nextCond = assessments?.[currIndex + 1]?.question?.id;
        if (nextCond) {
          setCurrentAssId(nextCond);
        } else {
          //submit
          const _answers = Object.entries(newAnswers).map(([key, value]) => {
            return {
              questionId: parseInt(key),
              selections: value,
            };
          });
          Handlers.handleSubmit(_answers as IExamAnswerPayload[]);
        }
      }
    },
  };

  const ModalContent = () => {
    return (
      <Box className="grid w-72 justify-self-center">
        <p className="flex justify-center pb-2 text-2xl font-bold">
          Reloaded examination
        </p>
        <span
          id="parent-modal-description"
          className="mt-3 whitespace-pre-line"
        >
          {`Candidate reloaded examination, your previous answers will not be submit. 
            \n Please log in to do examination again.`}
        </span>
        <Box className="inline-flex gap-10">
          <Button
            className="mt-5 w-full content-end"
            title="Delete"
            variant="contained"
            onClick={() => router.push('/')}
          >
            Accept
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <Box className="w-full flex-none md:w-64" bgcolor="#002a37">
        <Box className="flex w-full items-center justify-center p-9">
          <Typography color="#1ff29e" fontWeight="bold" fontSize="25px">
            Examination
          </Typography>
        </Box>
        <ExaminationInfo
          level={'Junior'}
          categories={['React', 'Javascript']}
        />
      </Box>
      <Box className="flex-grow bg-[#f9f9f9]">
        <Header>
          <CountdownTimer initialSeconds={3000} isPause={!assessmentInfo} />
        </Header>
        <Box
          className="m-6 flex-grow rounded-[15px] p-6 md:overflow-y-auto"
          bgcolor="#FFFFFF"
        >
          {assessments?.map((ass, index) => (
            <AssessmentQuestion
              key={ass.question.id}
              order={index + 1}
              isLast={assessments.length - 1 === index}
              assessment={ass}
              active={currentAssId === ass.question.id}
              onNext={Handlers.handleNext}
            />
          ))}
        </Box>
      </Box>
      <CustomModal ref={confirmModalRef}>
        <ModalContent />
      </CustomModal>
    </Box>
  );
};

export default ExaminationPage;
