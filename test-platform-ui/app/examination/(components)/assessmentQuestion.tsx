'use client';

import React, { useState } from 'react';

import { Box, Button, Typography } from '@mui/material';
import Question from './question';
import Answers from './answers';
import {
  IAssessment,
  IQuestion,
  QuestionType,
} from '@/app/constants/assessments';
import MultipleChoice from './multipleChoice';
import SingleChoice from './singleChoice';
import { ArrowForwardIos } from '@mui/icons-material';

interface IProps {
  order: number;
  assessment: IQuestion;
  active: boolean;
  onNext: ({ currId, answers }: { currId: number; answers: number[] }) => void;
}

const AssessmentQuestion: React.FC<IProps> = ({
  order,
  assessment,
  active,
  onNext,
}) => {
  const [answers, setAnswers] = useState<number[]>([]);

  const handleNext = () => {
    onNext({ currId: assessment.question.id, answers });
  };

  const handleCheck = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setAnswers((prev) => [...prev, Number(value)]);
    } else {
      setAnswers((prev) => prev.filter((val: number) => val !== Number(value)));
    }
  };
  const handleSelect = (event) => {
    setAnswers([Number(event.target.value)]);
  };

  if (!active) {
    return null;
  }

  const renderAnswers = () => {
    switch (assessment.question.type) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <SingleChoice
            options={assessment.question.options}
            onSelect={handleSelect}
          />
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoice
            options={assessment.question.options}
            onSelect={handleCheck}
          />
        );

      case QuestionType.TRUE_FALSE:
        return <>Missing Config TRUE_FALSE!!!</>;

      default:
        return <>Missing Config!!!</>;
    }
  };

  return (
    <>
      <Question order={order} question={assessment.question.question} />

      {renderAnswers()}

      <Box textAlign={'right'}>
        <Button
          variant="contained"
          title="Next"
          onClick={handleNext}
          disabled={!answers.length}
        >
          Next
        </Button>
      </Box>
    </>
  );
};

export default AssessmentQuestion;
