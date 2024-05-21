/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import RichTextArea from '@/components/atoms/Editor/richtext';
import { QuestionType } from '@/libs/definitions';
import { AddBox, Delete, Done, ModeEditOutline } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  FormHelperText,
  IconButton,
  Typography,
} from '@mui/material';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { IAnswer } from '../../models';

interface IQuestionAnswers {
  label?: string;
  questionType: string | undefined;
  renderAnswers: IAnswer[];
  error?:
    | {
        type: string;
        message: string;
      }
    | any;
  handleAnswers?: (answers: any) => void;
}

const initialAnswer = { id: '', answer: '', isCorrect: false };
const RenderQuestionAnswers = (props: IQuestionAnswers): ReactElement => {
  const { questionType, renderAnswers, error, label, handleAnswers } = props;
  const [answers, setAnswers] = useState<IAnswer[]>(
    renderAnswers.length ? renderAnswers : [initialAnswer],
  );

  const answersRef = useRef<IAnswer[]>(
    renderAnswers.length ? renderAnswers : [initialAnswer],
  );

  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    return () => {
      HandleInteractions.updateStateAnswers(answersRef.current);
    };
  }, []);

  //#region : Handle interaction functions
  const HandleInteractions = {
    updateStateAnswers: (updatedAnswers: IAnswer[]) => {
      setAnswers(updatedAnswers);
      handleAnswers && handleAnswers(updatedAnswers);
    },
    handleAnswerChanges: (event: React.ChangeEvent<HTMLInputElement>) => {
      const modifiedAnswers = answers.map((answer: IAnswer) => {
        if (answer.id === event.target.id) {
          return {
            ...answer,
            answer: event.target.value,
          };
        }
        return answer;
      });
      HandleInteractions.updateStateAnswers(modifiedAnswers);
    },
    handleRemoveAnswer: (answer: IAnswer) => {
      const minusAnswers = [...answers];
      minusAnswers.splice(minusAnswers.indexOf(answer), 1);
      if (minusAnswers.length < 4 && !minusAnswers.find((answ) => !answ.id)) {
        minusAnswers.push(initialAnswer);
      }
      HandleInteractions.updateStateAnswers(minusAnswers);
    },
    handleAddAnswer: () => {
      const modifiedAnswers = [...answers];
      modifiedAnswers[modifiedAnswers.length - 1].id = uuidv4();
      if (modifiedAnswers.length < 4) {
        modifiedAnswers.push(initialAnswer);
      }
      HandleInteractions.updateStateAnswers(modifiedAnswers);
    },
    handleSelectCorrect: (target: IAnswer) => {
      const updatedAnswers = answers.map((answ: IAnswer) => {
        if (answ.id === target.id) {
          return {
            ...answ,
            isCorrect: !answ.isCorrect,
          };
        } else if (questionType === QuestionType.SINGLE_CHOICE) {
          return { ...answ, isCorrect: false };
        }
        return answ;
      });
      HandleInteractions.updateStateAnswers(updatedAnswers);
    },
  };
  //#endregion

  //#region : Handle render answers
  const renderAnswer = (answ: IAnswer, index: number): ReactElement => {
    const [isEditable, toggleEditable] = useState<boolean>(false);
    return (
      <FormControl
        key={`answer-${answ.id}`}
        variant="standard"
        className="ml-3 inline-flex !flex-row items-center"
        sx={{
          backgroundColor: 'white',
          padding: '5px',
          borderRadius: '10px',
          border: 'solid 1px lightgrey',
          width: 'calc(100% - 30px)',
        }}
      >
        <Checkbox
          checked={answ.isCorrect}
          disabled={!answ.id}
          onClick={() => HandleInteractions.handleSelectCorrect(answ)}
        />
        {/** Notes: Specific cases answer include code patterns, simply envision the answer contents. */}
        <RichTextArea
          key="questionAnswersPreview"
          data={answ.answer}
          isReadOnly={!isEditable}
          onChange={(_val: any) => {
            const answersModified = answers.map(
              (answ: IAnswer, indx: number) => {
                if (index === indx) {
                  return { ...answ, answer: _val };
                }
                return answ;
              },
            );
            // HandleInteractions.updateStateAnswers(answersModified);
            answersRef.current = answersModified;
            setValue(
              'options',
              answersModified.map((answ) => answ.answer),
            );
          }}
        />

        {answ.id ? (
          <div className="answer-actions-wrapper flex justify-around gap-2 p-2">
            <IconButton
              color={isEditable ? 'success' : 'default'}
              onClick={() => toggleEditable(!isEditable)}
              type="button"
            >
              {isEditable ? <Done /> : <ModeEditOutline />}
            </IconButton>
            <IconButton
              color="error"
              onClick={() => HandleInteractions.handleRemoveAnswer(answ)}
              type="button"
            >
              <Delete />
            </IconButton>
          </div>
        ) : (
          <IconButton
            color="primary"
            disabled={!answ.answer.trim().length}
            onClick={HandleInteractions.handleAddAnswer}
            type="button"
          >
            <AddBox />
          </IconButton>
        )}
      </FormControl>
    );
  };
  //#endregion

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
        {answersRef.current.map(renderAnswer)}
      </Box>
      {errors.root || error ? (
        <FormHelperText className="mt-4" error>
          {errors?.root?.message || error?.message}
        </FormHelperText>
      ) : null}
    </FormGroup>
  );
};

export default RenderQuestionAnswers;
