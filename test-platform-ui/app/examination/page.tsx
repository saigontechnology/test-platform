'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Header from '../components/organisms/Header';
import CountdownTimer from './(components)/countdownTimer';
import ApiHook, { Methods } from '../lib/apis/ApiHook';
import AssessmentQuestion from './(components)/assessmentQuestion';
import { IAssessment, IQuestion } from '../constants/assessments';

const ExaminationPage = ({ children }: { children: React.ReactNode }) => {
  const [assessments, setAssessments] = useState<IQuestion[]>([]);
  const [currentAssId, setCurrentAssId] = useState<number>(0);

  console.log('💊 ~ currentAssId:', currentAssId);
  const [answers, setAnswers] = useState<Record<string, number[]>>();

  console.log('💊 ~ answers:', answers);

  useEffect(() => {
    (async () => {
      const res: { data: IAssessment } = await ApiHook(
        Methods.GET,
        '/assessments/2',
      );
      if (res.data.assessmentQuestionMapping.length) {
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

  const handleNext = ({
    currId,
    answers,
  }: {
    currId: number;
    answers: number[];
  }) => {
    const currIndex = assessments.findIndex(
      (ass) => ass.question.id === currId,
    );
    if (currIndex > -1) {
      setAnswers((prev) => ({ ...prev, [currId]: answers }));
      setCurrentAssId(assessments[currIndex + 1].question.id);
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
              assessment={ass}
              active={currentAssId === ass.question.id}
              onNext={handleNext}
            />
          ))}
          {/* {children} */}
        </Box>
      </Box>
    </Box>
  );
};

export default ExaminationPage;
