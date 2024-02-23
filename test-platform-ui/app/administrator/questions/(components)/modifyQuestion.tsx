/* eslint-disable @next/next/no-async-client-component */
'use client';

import CustomTextField from '@/app/components/atoms/CustomTextField';
import RichTextArea from '@/app/components/atoms/Editor/richtext';
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
  Stack,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import RenderQuestionAnswers from './(question-form)/answers';
import RenderQuestionType from './(question-form)/questionType';

export interface IQuestionInfo {
  id: number;
  question: string;
  description: string;
  categories: string[];
  answers: number[];
  options: string[];
  type: string;
}

interface ICreateQuestion {
  questionData: IQuestionInfo;
}

export interface IAnswer {
  id: string;
  answer: string;
  isCorrect: boolean;
}

const ModifyQuestion = (props: ICreateQuestion) => {
  const { questionData } = props;
  const router = useRouter();

  const mapEditAnswer = () => {
    const { options, answers } = questionData;

    return options.map((option: string, index: number) => ({
      id: uuidv4(),
      answer: option,
      isCorrect: answers.includes(index),
    }));
  };

  const [answerArray, setAnswerArray] = useState<IAnswer[]>(mapEditAnswer());

  const form = useForm<IAddQuestion>({
    defaultValues: {
      question: questionData.question,
      description: questionData.description,
      type: questionData.type,
    },
    resolver: yupResolver(createQuestionSchema),
  });
  const { setError, watch } = form;
  const questionType = watch("type");

  //#region : Handle interactive functions
  const HandleInteractions = {
    handleQuestionContentChange: () => {},
    handleRedirect: (route: string) => {
      router.push(route);
    },
    handleModifiedQuestion: async (modifiedQuestion: IAddQuestion) => {
      const formData = {
        question: modifiedQuestion.question,
        description: modifiedQuestion.description,
        answer: answerArray.filter((answer) => answer.id).map((answer, index) => answer.isCorrect ? index : -1).filter(index => index > -1),
        options: answerArray.filter((answer) => answer.id).map((answer) => answer.answer),
        category: 'React',
        type: modifiedQuestion.type,
      };
      if (formData.answer.length) {
        const { error } = await (questionData.id
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
        setError("root", { type: "minLength", message: "At least one checkbox has been checked"});
      }
    },
  };
  //#endregion

  //#region : Create question form
  return (
    <Box>
      <Box className="flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl mb-10`}>
          {questionData.id ? 'Edit' : 'Create'} Question
        </Typography>
      </Box>
      <FormProvider {...form}>
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
            <FormControl variant="standard" className="!w-11/12 pb-7">
              <Typography className="font-semibold">Question</Typography>
              <CustomTextField
                name="question"
                className="ring-offset-0"
                multiline
                maxRows={5}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
              />
            </FormControl>
            <FormControl variant="standard" className="!w-11/12 pb-7">
              <Typography className="font-semibold">Description</Typography>
              <RichTextArea name="description" data={questionData?.description} />
            </FormControl>
          </Box>
          <Stack className="basis-1/2 gap-7" flexDirection="column">
            <RenderQuestionType />
            <RenderQuestionAnswers
              questionType={questionType}
              renderAnswers={answerArray}
              handleAnswers={setAnswerArray}
            />
          </Stack>
        </Box>
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
          <Button
            color="primary"
            variant="contained"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(
              HandleInteractions.handleModifiedQuestion,
            )}
          >
            {questionData.id ? 'Edit' : 'Create'}
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
