'use client';

import React, { useState } from 'react';

import { IQuestion, QuestionType } from '@/app/constants/assessments';
import { Box, Button } from '@mui/material';
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
      <Question order={order} question={assessment.question} />
      {renderAnswers()}

      <Box textAlign={'right'}>
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
