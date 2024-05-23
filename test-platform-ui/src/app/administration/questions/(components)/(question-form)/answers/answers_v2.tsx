'use client';

import { QuestionType } from '@/libs/definitions';
import { Box, FormGroup, FormHelperText, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import RenderAnswer from './renderAnswer';

interface IQuestionAnswers {
  label?: string;
  renderAnswers: string[];
  correctAnswers: number[];
  error?:
    | {
        type: string;
        message: string;
      }
    | any;
}

const RenderQuestionAnswers2 = (props: IQuestionAnswers): ReactElement => {
  const { label, error, renderAnswers, correctAnswers } = props;
  const [selectedAnswers, setSelectedAnswers] =
    useState<number[]>(correctAnswers);
  const [answers, setAnswers] = useState<string[]>(
    renderAnswers.length ? renderAnswers : [''],
  );
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const questionType = getValues('type');

  useEffect(() => {
    setSelectedAnswers(new Array());
    setValue('answers', new Array());
  }, [questionType]);

  const handleUpdateAnswer = (updateVal: string, AnswIndx: number) => {
    const updatedOptions = answers.map((_answ: string, indx: number) => {
      if (indx === AnswIndx) {
        return updateVal;
      }
      return _answ;
    });
    setValue('options', updatedOptions);
    setAnswers(updatedOptions);
  };

  const handleSelectedAnswer = (index: number) => {
    let _selectedAnsw = null;

    // Remove selected:
    if (selectedAnswers.includes(index) && selectedAnswers.length > 1) {
      _selectedAnsw = [...selectedAnswers];
      _selectedAnsw.splice(_selectedAnsw.indexOf(index), 1);
    } else if (!selectedAnswers.includes(index)) {
      /** On select:
       *    - Condition to execute handle selected options with not existed - not selected
       **/
      // Multiple select:
      if (questionType === QuestionType.MULTIPLE_CHOICE) {
        _selectedAnsw = selectedAnswers.concat(index);
      }
      // Single select:
      if (questionType === QuestionType.SINGLE_CHOICE) {
        _selectedAnsw = [index];
      }
    }
    if (_selectedAnsw != null) {
      setSelectedAnswers(_selectedAnsw);
      setValue('answers', _selectedAnsw);
    }
  };

  return (
    <FormGroup className="gap-1">
      {label?.length ? (
        <Typography className="font-semibold">{label}</Typography>
      ) : null}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflow: 'hidden',
          paddingBottom: '20px',
        }}
      >
        {answers.map((answ: string, indx: number) => (
          <RenderAnswer
            key={`${answ.length}-${indx}`}
            answ={answ}
            questionType={questionType as any}
            index={indx}
            updateAnswerContent={handleUpdateAnswer}
            selectAnswer={handleSelectedAnswer}
            isSelected={selectedAnswers.includes(indx)}
          />
        ))}
      </Box>
      {errors.root || error ? (
        <FormHelperText className="mt-4" error>
          {errors?.root?.message || error?.message}
        </FormHelperText>
      ) : null}
    </FormGroup>
  );
};

export default RenderQuestionAnswers2;
