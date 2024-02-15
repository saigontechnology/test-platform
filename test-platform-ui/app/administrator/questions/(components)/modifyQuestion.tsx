/* eslint-disable @next/next/no-async-client-component */
'use client';

import CustomTextField from '@/app/components/atoms/CustomTextField';
import { IAddQuestion } from '@/app/constants/questions';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { createQuestionSchema } from '@/app/validations/questions';
import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import RenderQuestionType from './(question-form)/questionType';
import RichTextArea from './editor/richtext';

export interface IQuestionInfo {
  id: number;
  title: string;
  content: string;
  categories: string[];
  answers: number[];
  options: string[];
  type: string;
}

interface ICreateQuestion {
  questionData?: IQuestionInfo;
}

export interface IAnswer {
  id: number;
  answer: string;
  isCorrect: boolean;
}

const ModifyQuestion = (props: ICreateQuestion) => {
  const { questionData } = props;
  const router = useRouter();
  const [questionType, setQuestionType] = useState<string>(
    questionData?.type.split('_')[0].toLowerCase() || 'single',
  );

  const mapEditAnswer = (options: string[], answers: number[]) => {
    const _mapped = options?.map((opt: string, indx: number) => ({
      id: indx,
      answer: opt,
      isCorrect: answers.includes(indx),
    }));
    return _mapped;
  };

  const [answerArray, setAnswerArray] = useState<IAnswer[]>(
    questionData
      ? mapEditAnswer(questionData?.options, questionData?.answers)
      : [],
  );

  const form = useForm<IAddQuestion>({
    defaultValues: {
      title: questionData?.title,
      content: questionData?.content,
    },
    resolver: yupResolver(createQuestionSchema),
  });

  //#region : Handle interactive functions
  const HandleInteractions = {
    handleQuestionContentChange: () => {},
    handleRedirect: (route: string) => {
      router.push(route);
    },
    handleQuestionType: (
      event: React.MouseEvent<HTMLElement>,
      selectedType: string,
    ) => {
      event.preventDefault();
      setQuestionType((prevType) =>
        prevType != selectedType ? selectedType : prevType,
      );
    },
    handleModifiedQuestion: async (modifiedQuestion: IAddQuestion) => {
      console.log('handleModifiedQuestion content: ', modifiedQuestion.content);
      const formData = {
        question: modifiedQuestion.title,
        description: modifiedQuestion.content,
        answer: answerArray.reduce((array: any, answ: any) => {
          return answ.isCorrect ? [...array, answ.id] : array;
        }, []),
        options: answerArray.map((answ: IAnswer) => answ.answer),
        category: 'React',
        type: questionType === 'single' ? 'SINGLE_CHOICE' : 'MULTIPLE_CHOICE',
      };
      if (formData.answer.length) {
        const { error } = await (questionData
          ? ApiHook(Methods.PUT, `/questions/${questionData.id}`, {
              data: formData,
            })
          : ApiHook(Methods.POST, '/questions', {
              data: formData,
            }));
        if (!error) {
          HandleInteractions.handleRedirect('/administrator/questions');
        }
      } else {
        alert(`Incorrect fields in create form`);
      }
    },
  };
  //#endregion

  //#region : Create question form
  return (
    <Box>
      <FormProvider {...form}>
        <Typography className="mx-2 my-4 mb-10 text-2xl">
          {`${questionData ? 'Edit' : 'New'} Question`}
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-row"
          onSubmit={form.handleSubmit(
            HandleInteractions.handleModifiedQuestion,
          )}
        >
          <Box className="grid basis-1/2">
            <FormControl variant="standard" className="!w-4/5 pb-7">
              <Typography className="ml-2 font-semibold">Title</Typography>
              <CustomTextField
                name="title"
                id="question-title-input"
                className="mx-2 my-2 ring-offset-0"
              />
            </FormControl>
            <FormControl variant="standard" className="!w-4/5 pb-7">
              <Typography className="ml-2 font-semibold">Content</Typography>
              <RichTextArea name="content" />
            </FormControl>
          </Box>
          <RenderQuestionType
            className="basis-1/2"
            questionType={questionType}
            handleChangeQuestionType={HandleInteractions.handleQuestionType}
            answers={answerArray}
            handleAnswers={(answers: IAnswer[]) => {
              console.log('handle set answers: ', answers);
              setAnswerArray(answers);
            }}
          />
        </Box>
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
          <Button
            variant="contained"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(
              HandleInteractions.handleModifiedQuestion,
            )}
          >
            {`${questionData ? 'Edit' : 'Create'}`}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={() =>
              HandleInteractions.handleRedirect('/administrator/questions')
            }
          >
            Cancel
          </Button>
        </ButtonGroup>
      </FormProvider>
    </Box>
  );
  //#endregion
};

export default ModifyQuestion;
