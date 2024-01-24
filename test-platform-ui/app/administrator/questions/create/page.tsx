/* eslint-disable @next/next/no-async-client-component */
'use client';

import CustomTextArea from '@/app/components/atoms/CustomTextArea';
import CustomTextField from '@/app/components/atoms/CustomTextField';
import { ICreateQuestion } from '@/app/constants/questions';
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
import React, { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import RenderQuestionType from './(components)/questionType';
import { DevTool } from '@hookform/devtools';
import ApiHook, { Methods } from '@/app/lib/ApiHook';

export interface IAnswer {
  id: number;
  answer: string;
  isCorrect: boolean;
}

interface IQuestion {
  type: string;
  title: string;
  content: string;
  answers: IAnswer[];
}

export default function CreateQuestion() {
  const router = useRouter();
  const [questionType, setQuestionType] = useState<string>('single');
  const answerArray = useRef<IAnswer[]>([]);

  const form = useForm<ICreateQuestion>({
    defaultValues: {
      title: '',
      content: '',
    },
    resolver: yupResolver(createQuestionSchema),
  });
  const { control } = form;

  const handleQuestionType = (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string,
  ) => {
    event.preventDefault();
    setQuestionType((prevType) =>
      prevType != selectedType ? selectedType : prevType,
    );
  };

  const handleAddQuestion = (questionData: ICreateQuestion) => {
    const formData = {
      ...questionData,
      type: questionType,
      answers: answerArray.current,
    };
    const response = ApiHook(Methods.POST, '/questions', {
      data: formData,
    });
    console.log('add question: ', formData, response);
  };

  const handleRedirect = (route: string) => {
    router.push(route);
  };

  //#region : Create question form
  return (
    <FormProvider {...form}>
      <Typography className="mx-2 my-4 mb-10 text-2xl">
        Create a new question
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="flex flex-row"
        onSubmit={form.handleSubmit(handleAddQuestion)}
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
            <CustomTextArea
              className="mx-2 my-2 w-full"
              minRows={4}
              name="content"
              isResizeAble={true}
              isMultipleLine
            />
          </FormControl>
        </Box>
        <RenderQuestionType
          className="basis-1/2"
          questionType={questionType}
          handleChangeQuestionType={handleQuestionType}
          handleAnswers={(answers: IAnswer[]) =>
            (answerArray.current = answers)
          }
        />
      </Box>
      <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
        <Button
          variant="contained"
          startIcon={<LibraryAddIcon />}
          onClick={form.handleSubmit(handleAddQuestion)}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={(evt: React.MouseEvent) =>
            handleRedirect('/administrator/questions')
          }
        >
          Cancel
        </Button>
      </ButtonGroup>
      <DevTool control={control} />
    </FormProvider>
  );
  //#endregion
}
