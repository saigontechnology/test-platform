'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import Header from '../components/organisms/Header';
import { IAssessment, IQuestion } from '../constants/assessments';
import ApiHook, { Methods } from '../lib/apis/ApiHook';
import AssessmentQuestion from './(components)/assessmentQuestion';
import CountdownTimer, {
  CountdownTimerHandler,
} from './(components)/countdownTimer';
import ExaminationInfo from './(components)/examInformation';
import ExaminationResult from './(components)/result';

interface IExamAnswerPayload {
  questionId: number;
  selections: number[];
}

const ExaminationPage = () => {
  const [assessmentInfo, setAssessmentInfo] = useState<IAssessment>();
  const [assessments, setAssessments] = useState<IQuestion[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const countdownTimerRef = useRef<CountdownTimerHandler>(null);

  useEffect(() => {
    (async () => {
      const res: { data: IAssessment } = await ApiHook(
        Methods.GET,
        '/assessments/2',
      );
      if (res.data.assessmentQuestionMapping.length) {
        const cachedQuestion = JSON.parse(
          sessionStorage.getItem('examination')!,
        )?.currentQ;
        try {
          setAssessmentInfo(res.data);
          setAssessments(res.data.assessmentQuestionMapping);
          setCurrentQuestionId(
            cachedQuestion || res.data.assessmentQuestionMapping[0].question.id,
          );
        } finally {
          countdownTimerRef.current?.setTime(1200);
        }
      } else {
        // TODO:
      }
    })();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
      // sessionStorage.setItem('finished', (+new Date()).toString(36));
      sessionStorage.setItem(
        'examination',
        JSON.stringify({
          timer: countdownTimerRef.current?.getTime() as any,
          currentQ: currentQuestionId,
        }),
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentQuestionId]);

  const Handlers = {
    handleSubmit: async (finalAnswers: IExamAnswerPayload[]) => {
      setIsSubmit(true);
      const payload = {
        email: sessionStorage.getItem('candidateEmail'),
        assessmentId: assessmentInfo?.id,
        selections: finalAnswers,
      };
      const { error } = await ApiHook(Methods.POST, '/examinations', {
        data: payload,
      });
      if (error) {
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
          setCurrentQuestionId(nextCond);
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
          <CountdownTimer ref={countdownTimerRef} isPause={!assessmentInfo} />
        </Header>
        <Box
          className="m-6 flex-grow rounded-[15px] p-6 md:overflow-y-auto"
          bgcolor="#FFFFFF"
        >
          {!isSubmit &&
            assessments?.map((ass, index) => (
              <AssessmentQuestion
                key={ass.question.id}
                order={index + 1}
                isLast={assessments.length - 1 === index}
                assessment={ass}
                active={currentQuestionId === ass.question.id}
                onNext={Handlers.handleNext}
              />
            ))}
          {isSubmit && (
            <ExaminationResult
              isDisabledExit={false}
              examResult={{
                information: assessmentInfo,
                scored: 70,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ExaminationPage;
