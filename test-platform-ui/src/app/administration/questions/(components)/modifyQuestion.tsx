'use client';

import EditorLogic, {
  EditorCode,
} from '@/components/atoms/CodeEditor/editorLogic/editorLogic';
import EditorUI from '@/components/atoms/CodeEditor/editorUI';
import CustomTextField from '@/components/atoms/CustomModules/CustomTextField';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { IAddQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import { QuestionType } from '@/libs/definitions';
import { decodeHtml, isStringHTML } from '@/libs/utils';
import { createQuestionSchema } from '@/validations/questions';
import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import {
  Alert,
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
import QuestionStandard from './(question-form)/questionLevel';
import QuestionKind from './(question-form)/questionType';

export interface IQuestionInfo {
  id: number;
  question: string;
  description: string;
  notes?: string;
  level: string;
  categories: any;
  answers: number[];
  options: string[];
  type: string;
  isModified: boolean;
}

interface ICreateQuestion {
  questionData: IQuestionInfo;
}

export interface IAnswer {
  id: string;
  answer: string;
  isCorrect: boolean;
}

const manualErrors = [
  {
    type: 'manual',
    name: 'answers',
    message:
      'Selected answer(s) is not default correct answer(s). Please add explanation incase you ensure selected is correct answer(s) !',
  },
];

export default function ModifyQuestion(props: ICreateQuestion) {
  const { questionData } = props;
  const router = useRouter();
  // const [isSubmitLoading] = useState<boolean>(false);
  const [isExistHTMLAns, setIsExistHTMLAns] = useState<boolean>(false);
  const [isValidAnswer, setIsValidAnswer] = useState<boolean>(false);

  const mapEditAnswer = () => {
    const { options, answers } = questionData;
    const mappedOpts = options.map((option: string, index: number) => ({
      id: uuidv4(),
      answer: option,
      isCorrect: answers.includes(index),
    }));

    return mappedOpts;
  };

  const [answerArray, setAnswerArray] = useState<IAnswer[]>(mapEditAnswer());

  const form = useForm<any>({
    // interface: IAddQuestion
    defaultValues: {
      description: questionData.description,
      question: questionData.question,
      type: questionData.type,
      categories: questionData.categories,
      notes: questionData.notes,
      level: questionData.level,
      answers: questionData.answers,
    },
    resolver: yupResolver(createQuestionSchema),
  });
  const {
    watch,
    getValues,
    formState: { isValid, errors },
  } = form;
  const questionType = watch('type');
  // const notes = watch('notes');

  const previewHTMLAnswer = useMemo(() => {
    const _answer = answerArray.find((ans) => ans.isCorrect)?.answer || '';
    const decodedHTML = decodeHtml(_answer);

    return (
      <>
        {/* <div
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: answerArray.find((ans) => ans.isCorrect)?.answer || '',
          }}
        /> */}
        <EditorCode
          language={'html'}
          value={decodedHTML}
          height={300}
          width={900}
        />
      </>
    );
  }, [answerArray]);

  useEffect(() => {
    console.log('isValid: ', isValid, getValues(), errors);
  });

  useEffect(() => {
    const isExistHTMLAnswer = answerArray.find((ans) =>
      isStringHTML(ans.answer),
    );
    setIsExistHTMLAns(isExistHTMLAnswer ? true : false);

    // Validate selected answer(s):
    const originalAnswers = questionData.answers.sort().join(',');

    const selectedAnswers = answerArray
      .map((a, i) => (a.isCorrect ? i : null))
      .filter((a) => typeof a === 'number')
      .sort()
      .join(',');

    console.log('answer change', originalAnswers, selectedAnswers);

    setIsValidAnswer(originalAnswers === selectedAnswers);
  }, [answerArray]);

  //#region : Handle interactive functions
  const HandleInteractions = {
    handleAnswerChange: (answers: IAnswer[]) => {
      setAnswerArray(answers);
    },
    // handleQuestionContentChange: () => {},
    handleRedirect: (route: string) => {
      router.push(route);
    },
    handleModifiedQuestion: async (modifiedQuestion: IAddQuestion) => {
      // Payload data:
      const formData = {
        question: modifiedQuestion.question,
        description: modifiedQuestion.description,
        categories: modifiedQuestion.categories,
        category: modifiedQuestion.categories[0],
        level: modifiedQuestion.level,
        type: modifiedQuestion.type,
        answer: answerArray
          .filter((answer) => answer.id)
          .map((answer, index) => (answer.isCorrect ? index : -1))
          .filter((index) => index > -1),
        options: answerArray
          .filter((answer) => answer.id)
          .map((answer) => answer.answer),
        notes: modifiedQuestion.notes,
        isModified: true,
      };

      console.log('formData: ', formData);

      // Executive handler data modified:
      // if (formData.answer.length) {
      //   setIsSubmitLoading(true);
      //   const { error } = await (questionData.id
      //     ? ApiHook(Methods.PUT, `/questions/${questionData.id}`, {
      //         data: formData,
      //       })
      //     : ApiHook(Methods.POST, '/questions', {
      //         data: formData,
      //       }));
      //   setIsSubmitLoading(false);
      //   if (!error) {
      //     showNotification('Upsert question successfully', 'success');
      //     HandleInteractions.handleRedirect(ROUTE_KEY.ADMINISTRATION_QUESTIONS);
      //   }
      // } else {
      //   setError('root', {
      //     type: 'minLength',
      //     message: 'At least one checkbox has been checked',
      //   });
      // }
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

  const isDisabledSubmit = (): boolean => {
    // const d = document.createElement('div');
    // d.innerHTML = notes;
    // const textContent = d.textContent || d.innerText;

    // console.log('isDisabledSubmit: ', textContent, textContent.length);
    // return (
    //   !isValid ||
    //   (!isValidAnswer && !textContent?.length) ||
    //   isSubmitLoading ||
    //   questionType == QuestionType.CODING
    // );
    return true;
  };

  //#region : Create question form
  return (
    <Box>
      <Box className="mb-9 flex items-center justify-between">
        <Typography component="h1" className={`w-full text-xl md:text-2xl`}>
          {questionData.id ? 'Edit' : 'Create'} Question
        </Typography>
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
          <Button
            color="primary"
            variant="contained"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(
              HandleInteractions.handleModifiedQuestion,
            )}
            disabled={isDisabledSubmit()}
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
          <Box className="basis-2/5">
            <FormControl variant="standard" className="!w-11/12 pb-7">
              <Typography className="font-semibold">Question</Typography>
              <CustomTextField
                name="question"
                className="ring-offset-0"
                multiline
                maxRows={3}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    event.preventDefault();
                  }
                }}
              />
            </FormControl>
            <FormControl variant="standard" className="!w-11/12 pb-7">
              <Typography className="pb-4 font-semibold">
                Description
              </Typography>
              <RichTextArea
                name="description"
                data={getValues('description') || questionData?.description}
              />
            </FormControl>
            <FormControl variant="standard" className="!w-11/12 pb-7">
              <Typography className="pb-4 font-semibold">
                Notes / Explanation:
              </Typography>
              <RichTextArea
                name="notes"
                data={getValues('notes') || questionData?.notes}
              />
            </FormControl>
          </Box>
          <Stack
            className="basis-3/5 gap-4"
            flexDirection="column"
            sx={{
              borderLeft: 'solid 1px #00000024',
              paddingLeft: 6,
            }}
          >
            <QuestionStandard />
            <QuestionKind />
            {questionType === QuestionType.CODING ||
            questionType === QuestionType.LOGIC ? (
              HandleInteractions.handleRenderCoding()
            ) : (
              <>
                <Stack className="mx-2 my-2 gap-12" direction="row" spacing={2}>
                  <RenderQuestionAnswers
                    questionType={questionType}
                    renderAnswers={answerArray}
                    handleAnswers={HandleInteractions.handleAnswerChange}
                    error={errors['answers'] as any}
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
                {!isValidAnswer ? (
                  <Alert severity="error">{manualErrors[0]?.message}</Alert>
                ) : null}
              </>
            )}
          </Stack>
        </Box>
      </FormProvider>
    </Box>
  );
  //#endregion
}
