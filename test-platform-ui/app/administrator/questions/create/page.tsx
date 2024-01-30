/* eslint-disable @next/next/no-async-client-component */
'use client';

import CustomTextArea from '@/app/components/atoms/CustomTextArea';
import CustomTextField from '@/app/components/atoms/CustomTextField';
import { IAddQuestion } from '@/app/constants/questions';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { createQuestionSchema } from '@/app/validations/questions';
import { DevTool } from '@hookform/devtools';
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
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import RenderQuestionType from './(components)/questionType';

interface ICreateQuestion {
  questionData: any;
}

export interface IAnswer {
  id: number;
  answer: string;
  isCorrect: boolean;
}

export default function CreateQuestion(props: ICreateQuestion) {
  const { questionData } = props;
  const router = useRouter();
  const [questionType, setQuestionType] = useState<string>(
    questionData?.type.split('_')[0].toLowerCase() || 'single',
  );
  const [answerArray, setAnswerArray] = useState<IAnswer[]>([]);

  const mapEditAnswer = (options: string[], answers: number[]) => {
    const _mapped = options?.map((opt: string, indx: number) => ({
      id: indx,
      answer: opt,
      isCorrect: answers.includes(indx),
    }));
    return _mapped;
  };

  useEffect(() => {
    const mappedAnswer = mapEditAnswer(
      questionData?.options,
      questionData?.answers,
    );
    setAnswerArray(mappedAnswer);
  }, [questionData]);

  const form = useForm<IAddQuestion>({
    defaultValues: {
      title: questionData?.title,
      content: questionData?.content,
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

  const handleAddQuestion = (questionData: IAddQuestion) => {
    const formData = {
      ...questionData,
      type: questionType,
      answers: answerArray,
    };
    const response = ApiHook(Methods.POST, '/questions', {
      data: formData,
    });
    console.log('add question: ', formData, response);
  };

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
          {answerArray?.length ? (
            <RenderQuestionType
              className="basis-1/2"
              questionType={questionType}
              handleChangeQuestionType={handleQuestionType}
              answers={answerArray}
              handleAnswers={(answers: IAnswer[]) => setAnswerArray(answers)}
            />
          ) : null}
        </Box>
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
          <Button
            variant="contained"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(handleAddQuestion)}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </ButtonGroup>
        <DevTool control={control} />
      </FormProvider>
    </Box>
  );
  //#endregion
}
