'use client';

import { QuestionType } from '@/libs/definitions';
import { Box, FormGroup, FormHelperText, Typography } from '@mui/material';
import { ReactElement, useState } from 'react';
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
  const { label, error } = props;
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const questionType = watch('type');
  const watchAnswers = watch('answers');
  const watchOtps: string[] = watch('options');

  /** useState hook use to trigger re-render updated/modified answers */
  const [_answers, setAnswers] = useState<string[]>(watchOtps);

  const Handlers = {
    handleUpdateAnswer: (updateVal: string, AnswIndx: number) => {
      const updatedOptions = watchOtps.map((_answ: string, indx: number) => {
        if (indx === AnswIndx) {
          return updateVal;
        }
        return _answ;
      });
      setValue('options', updatedOptions);
    },
    handleAddAnswer: (content: string) => {
      watchOtps.push(content);
      setAnswers((prevState) => {
        return prevState.concat(new Array(content));
      });
    },
    handleDeleteAnswer: (answIndx: number) => {
      watchOtps.splice(answIndx, 1);
      const minusAnswers = [..._answers];
      minusAnswers.splice(answIndx, 1);
      setAnswers(minusAnswers);
    },
    handleSelectedAnswer: (index: number) => {
      let _selectedAnsw = null;
      // Remove selected:
      if (watchAnswers.includes(index) && watchAnswers.length > 1) {
        _selectedAnsw = [...watchAnswers];
        _selectedAnsw.splice(_selectedAnsw.indexOf(index), 1);
      } else if (!watchAnswers.includes(index)) {
        /** On select:
         *    - Condition to execute handle selected options with not existed - not selected
         **/
        // Multiple select:
        if (questionType === QuestionType.MULTIPLE_CHOICE) {
          _selectedAnsw = watchAnswers.concat(index);
        }
        // Single select:
        if (questionType === QuestionType.SINGLE_CHOICE) {
          _selectedAnsw = [index];
        }
      }
      if (_selectedAnsw != null) {
        setValue('answers', _selectedAnsw);
      }
    },
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
        }}
      >
        {watchOtps?.map((answ: string, indx: number) => (
          /** Render answers */
          <RenderAnswer
            key={`${answ.length}-${indx}`}
            answ={answ}
            questionType={questionType as any}
            index={indx}
            modifyAnswerContent={Handlers.handleUpdateAnswer}
            selectAnswer={Handlers.handleSelectedAnswer}
            onDelete={Handlers.handleDeleteAnswer}
            isSelected={watchAnswers.includes(indx)}
          />
        ))}
        {watchOtps?.length < 5 ? (
          /** Render add new answer */
          <RenderAnswer
            key={`add-new-answ`}
            answ={''}
            questionType={questionType as any}
            index={-1}
            modifyAnswerContent={Handlers.handleAddAnswer}
            selectAnswer={Handlers.handleSelectedAnswer}
            isSelected={watchAnswers.includes(0)}
          />
        ) : null}
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
