/* eslint-disable @next/next/no-async-client-component */
'use client';

// import EditorUI from '@/components/atoms/CodeEditor/editorUI';
import EditorLogic from '@/components/atoms/CodeEditor/editorLogic/editorLogic';
import EditorUI from '@/components/atoms/CodeEditor/editorUI';
import CustomTextField from '@/components/atoms/CustomModules/CustomTextField';
import RichTextArea from '@/components/atoms/Editor/Richtext';
import { QuestionType } from '@/constants/assessments';
import { IAddQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { showNotification } from '@/libs/toast';
import { isStringHTML } from '@/libs/utils';
import { createQuestionSchema } from '@/validations/questions';
import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isExistHTMLAns, setIsExistHTMLAns] = useState<boolean>(false);

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
  const { setError, watch, getValues } = form;
  const questionType = watch('type');

  const previewHTMLAnswer = useMemo(() => {
    return (
      <>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: answerArray.find((ans) => ans.isCorrect)?.answer || '',
          }}
        />
      </>
    );
  }, [answerArray]);

  useEffect(() => {
    const isExistHTMLAnswer = answerArray.find((ans) =>
      isStringHTML(ans.answer),
    );
    setIsExistHTMLAns(isExistHTMLAnswer ? true : false);
  }, [answerArray]);

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
        answer: answerArray
          .filter((answer) => answer.id)
          .map((answer, index) => (answer.isCorrect ? index : -1))
          .filter((index) => index > -1),
        options: answerArray
          .filter((answer) => answer.id)
          .map((answer) => answer.answer),
        category: 'React',
        type: modifiedQuestion.type,
      };
      if (formData.answer.length) {
        setIsSubmitLoading(true);
        const { error } = await (questionData.id
          ? ApiHook(Methods.PUT, `/questions/${questionData.id}`, {
              data: formData,
            })
          : ApiHook(Methods.POST, '/questions', {
              data: formData,
            }));
        setIsSubmitLoading(false);
        if (!error) {
          showNotification('Upsert question successfully', 'success');
          HandleInteractions.handleRedirect(ROUTE_KEY.ADMINISTRATION_QUESTIONS);
        }
      } else {
        setError('root', {
          type: 'minLength',
          message: 'At least one checkbox has been checked',
        });
      }
    },
    handleRenderCoding: (): JSX.Element => {
      if (questionType === QuestionType.CODING) {
        return <EditorUI customClass="mt-4" />;
      }
      if (questionType === QuestionType.LOGIC) {
        return <EditorLogic />;
      }
      return <></>;
    },
  };
  //#endregion

  //#region : Create question form
  return (
    <Box>
      <Box className="flex items-center justify-between">
        <Typography component="h1" className={`mb-10 text-xl md:text-2xl`}>
          {questionData.id ? 'Edit' : 'New'} Question
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
          <Box className="grid basis-2/5">
            <FormControl variant="standard" className="!w-11/12 pb-7">
              <Typography className="font-semibold">Question</Typography>
              <CustomTextField
                name="question"
                className="ring-offset-0"
                multiline
                maxRows={5}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                }}
              />
            </FormControl>
            <FormControl variant="standard" className="!w-11/12 pb-7">
              <Typography className="font-semibold">Description</Typography>
              <RichTextArea
                name="description"
                data={questionData?.description || getValues('description')}
              />
            </FormControl>
          </Box>
          <Stack className="basis-3/5 gap-7" flexDirection="column">
            <RenderQuestionType />
            {questionType === QuestionType.CODING ||
            questionType === QuestionType.LOGIC ? (
              HandleInteractions.handleRenderCoding()
            ) : (
              <Stack className="mx-2 my-2 gap-12" direction="row" spacing={2}>
                <RenderQuestionAnswers
                  questionType={questionType}
                  renderAnswers={answerArray}
                  handleAnswers={setAnswerArray}
                />
                {isExistHTMLAns ? (
                  <Box className="w-[inherit] overflow-hidden text-ellipsis whitespace-normal">
                    <Typography className="font-semibold">
                      Preview Code:
                    </Typography>
                    {previewHTMLAnswer}
                  </Box>
                ) : null}
              </Stack>
            )}
          </Stack>
        </Box>
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2 pt-12">
          <Button
            color="primary"
            variant="contained"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(
              HandleInteractions.handleModifiedQuestion,
            )}
            disabled={isSubmitLoading || questionType == QuestionType.CODING}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={() =>
              HandleInteractions.handleRedirect(
                ROUTE_KEY.ADMINISTRATION_QUESTIONS,
              )
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
