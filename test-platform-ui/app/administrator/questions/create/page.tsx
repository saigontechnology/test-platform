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
  const questionObj = useRef<IQuestion>({
    type: questionType,
    title: '',
    content: '',
    answers: [],
  });

  const form = useForm<ICreateQuestion>({
    defaultValues: {
      title: '',
      content: '',
      type: '',
    },
    resolver: yupResolver(createQuestionSchema),
  });

  const handleQuestionType = (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string,
  ) => {
    event.preventDefault();
    setQuestionType((prevType) =>
      prevType != selectedType ? selectedType : prevType,
    );
  };

  const handleAddQuestion = () => {
    const formData = form.getValues();
    console.log('add question: ', {
      ...formData,
      type: questionType,
    });
  };

  const handleRedirect = (route: string) => {
    router.push(route);
  };

  //#region : Create question form
  return (
    <FormProvider {...form}>
      <Box component="form" noValidate autoComplete="off" className="grid">
        <Typography className="mx-2 my-4 mb-10 text-2xl">
          Create a new question
        </Typography>
        <FormControl variant="standard" className="w-2/5 pb-7">
          <Typography className="ml-2 font-semibold">Title</Typography>
          <CustomTextField
            name="title"
            id="question-title-input"
            className="mx-2 my-2 ring-offset-0"
          />
        </FormControl>
        <FormControl variant="standard" className="w-2/5 pb-7">
          <Typography className="ml-2 font-semibold">Content</Typography>
          <CustomTextArea
            className="mx-2 my-2 w-full"
            minRows={4}
            name="content"
          />
        </FormControl>
        <RenderQuestionType
          questionType={questionType}
          handleChangeQuestionType={handleQuestionType}
          handleAnswers={(answers: IAnswer[]) =>
            (questionObj.current.answers = answers)
          }
        />
        <ButtonGroup className="footer action-buttons inline-flex justify-end gap-2">
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
      </Box>
    </FormProvider>
  );
  //#endregion
}
