/* eslint-disable @next/next/no-async-client-component */
'use client';

import {
  Box,
  Checkbox,
  FormControl,
  Input,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState, useEffect, ReactElement, useRef } from 'react';
import clsx from 'clsx';

interface IAnswer {
  id: number;
  answer: string;
  isCorrect: boolean;
}

export default function CreateQuestion() {
  const [questionType, setQuestionType] = useState<string | undefined>(
    'single',
  );
  const cb = useRef<any>();

  const handleQuestionTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event?.target.value);
  };

  const handleQuestionContent = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event?.target.value);
  };

  const handleQuestionType = (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string | undefined,
  ) => {
    console.log('question type: ', selectedType);
    setQuestionType((prevType) => {
      if (prevType != selectedType) {
        return selectedType;
      }
    });
  };

  useEffect(() => {
    console.log('quetion type updated: ', questionType);
  }, [questionType, setQuestionType]);

  const RenderQuestionTypeZone = (): ReactElement => {
    const [checkbox, toggleCheckBox] = useState<boolean>(true);
    const [answers, setAnswers] = useState<IAnswer[]>([
      { id: 1, answer: '', isCorrect: false },
      { id: 2, answer: '', isCorrect: false },
      { id: 3, answer: '', isCorrect: false },
      { id: 4, answer: '', isCorrect: false },
    ]);

    const handleAnswerChanges = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const modifiedAnswers = answers.map((answ: IAnswer) => {
        if (answ.id === +event.target.id.split('-')[1]) {
          return {
            ...answ,
            answer: event.target.value,
          };
        }
        return answ;
      });
      setAnswers(modifiedAnswers);
    };

    const handleSelectCorrect = (target: IAnswer) => {
      const updatedAnswers = answers.map((answ: IAnswer) => {
        if (answ.id === target.id) {
          return {
            ...answ,
            isCorrect: !answ.isCorrect,
          };
        } else if (questionType === 'single') {
          return { ...answ, isCorrect: false };
        }
        return answ;
      });
      console.log('handleSelectCorrect: ', target, updatedAnswers);
      setAnswers(updatedAnswers);
    };

    return (
      <>
        {answers.map((answ: IAnswer, index: number) => {
          return (
            <FormControl
              key={`answer-${answ.id}`}
              variant="standard"
              className="my-2.5 inline-flex w-2/5 flex-row items-center"
            >
              <input
                id="default-checkbox"
                type="checkbox"
                checked={answ.isCorrect}
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                onChange={(evt: any) => handleSelectCorrect(answ)}
              />
              <Input
                id={`answer-${answ.id}`}
                value={answ.answer}
                aria-describedby="component-helper-text"
                className="mx-2 my-2"
                placeholder={`Answer ${index + 1}`}
                onChange={handleAnswerChanges}
              />
            </FormControl>
          );
        })}
      </>
    );
  };

  //#region : Render select type question
  const RenderQuestionType = (): ReactElement => {
    const questionTypes = ['single', 'multiple'];
    return (
      <FormControl>
        <Typography className="ml-2">Question Type</Typography>
        <ToggleButtonGroup
          value={questionType}
          exclusive
          onChange={handleQuestionType}
          aria-label="text alignment"
          className="mx-2 my-2"
        >
          {questionTypes.map((type: string, indx: number) => {
            return (
              <ToggleButton
                key={`${type + indx}`}
                value={type}
                aria-label="left aligned"
                className={clsx({
                  'active !bg-sky-100 !font-extrabold !text-blue-600':
                    questionType === type,
                })}
              >
                <Typography>{`${type} choice`}</Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        {RenderQuestionTypeZone()}
      </FormControl>
    );
  };
  //#endregion

  //#region : Create question form
  return (
    <Box component="form" noValidate autoComplete="off" className="grid">
      <FormControl variant="standard" className="w-2/5 pb-7">
        <Typography className="ml-2">Question Title</Typography>
        <Input
          id="component-helper"
          defaultValue=""
          aria-describedby="component-helper-text"
          className="mx-2 my-2"
          onChange={handleQuestionTitle}
        />
      </FormControl>
      <FormControl variant="standard" className="w-2/5 pb-7">
        <Typography className="ml-2">Question Content</Typography>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={5}
          fullWidth
          className="mx-2 my-2 w-full"
          onChange={handleQuestionContent}
        />
      </FormControl>
      {RenderQuestionType()}
    </Box>
  );
  //#endregion
}
