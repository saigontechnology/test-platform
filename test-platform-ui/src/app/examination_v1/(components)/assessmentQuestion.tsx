'use client';

import React, { useState } from 'react';

import { IQuestion } from '@/constants/assessments';
import { QuestionType } from '@/libs/definitions';
import { Box, Button, Grid, Typography } from '@mui/material';
import MultipleChoice from './multipleChoice';
import Question from './question';
import SingleChoice from './singleChoice';

interface IProps {
  isLast: boolean;
  order: number;
  assessment: IQuestion;
  active: boolean;
  onNext: ({ currId, answers }: { currId: number; answers: number[] }) => void;
}

export const renderAnswers = (
  type: QuestionType,
  options: any[],
  handleSelect: (evt: any) => void,
  handleCheck: (evt: any) => void,
  isChecked?: number,
) => {
  switch (type) {
    case QuestionType.SINGLE_CHOICE:
      return (
        <SingleChoice
          options={options}
          onSelect={handleSelect}
          onChecked={isChecked}
        />
      );
    case QuestionType.MULTIPLE_CHOICE:
      return <MultipleChoice options={options} onSelect={handleCheck} />;
    case QuestionType.TRUE_FALSE:
      return <>Missing Config TRUE_FALSE!!!</>;
    default:
      return <>Missing Config!!!</>;
  }
};

const AssessmentQuestion: React.FC<IProps> = ({
  isLast,
  order,
  assessment,
  active,
  onNext,
}) => {
  const [answers, setAnswers] = useState<number[]>([]);

  const handleNext = () => {
    onNext({ currId: assessment.question.id, answers });
  };

  const handleCheck = (event: any) => {
    const { checked, value } = event.target;
    if (checked) {
      setAnswers((prev) => [...prev, Number(value)]);
    } else {
      setAnswers((prev) => prev.filter((val: number) => val !== Number(value)));
    }
  };

  const handleSelect = (event: any) => {
    setAnswers([Number(event.target.value)]);
  };

  if (!active) {
    return null;
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Box
            p={3}
            className="border-grey h-full rounded-[10px] border-2 bg-white"
          >
            <Question order={order} question={assessment.question} />
          </Box>
        </Grid>
        <Grid item xs={6} className="h-[70vh] overflow-hidden">
          <Box
            p={3}
            className="border-grey h-full rounded-[10px] border-2 bg-white"
          >
            <Typography variant="h6" className="mb-6">
              Answer
            </Typography>
            {renderAnswers(
              assessment.question.type,
              assessment.question.options,
              handleSelect,
              handleCheck,
            )}
          </Box>
        </Grid>
      </Grid>
      <Box className="mt-5 text-right">
        <Button
          variant="contained"
          title="Next"
          onClick={handleNext}
          disabled={!answers.length}
        >
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </>
  );
};

export default AssessmentQuestion;
