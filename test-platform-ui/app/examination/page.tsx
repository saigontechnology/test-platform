'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      // Custom logic to handle the refresh
      // Display a confirmation message or perform necessary actions
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSubmit = async (finalAnswers: IExamAnswerPayload[]) => {
    const payload = {
      email: sessionStorage.getItem('candidateEmail'),
      assessmentId: assessmentInfo?.id,
      selections: finalAnswers,
    };
    console.log(3, payload);
    const { error } = await ApiHook(Methods.POST, '/examinations', {
      data: payload,
    });
    if (!error) {
      router.push('/');
    } else {
      alert('Examination submit got error');
    }
  };

  const handleNext = ({
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
        handleSubmit(_answers as IExamAnswerPayload[]);
      }
    }
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
          <CountdownTimer initialSeconds={3000} />
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
              onNext={handleNext}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ExaminationPage;
