'use client';

import EditorLogic from '@/components/atoms/CodeEditor/editorLogic/editorLogic';
import EditorUI from '@/components/atoms/CodeEditor/editorUI';
import CustomTextField from '@/components/atoms/CustomModules/CustomTextField';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { IAddQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { QuestionType } from '@/libs/definitions';
import { showNotification } from '@/libs/toast';
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
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { QuestionPreview } from './(question-form)/preview';
import RenderQuestionAnswers from './(question-form)/questionFields/answers';
import AutocompleteDifficult from './(question-form)/questionFields/difficultyField';
import AutocompleteDuration from './(question-form)/questionFields/durationField';
import QuestionKind from './(question-form)/questionFields/questionType';
import AutocompleteSkill from './(question-form)/questionFields/skillField';

interface ICreateQuestion {
  questionData: IQuestionInfo;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export interface IQuestionInfo {
  id: number;
  question: string;
  description: string;
  notes?: string;
  level: string;
  categories: string[];
  category: string;
  answers: number[];
  options: string[];
  type: QuestionType;
  isModified: boolean;
  time: number;
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
    description: 'Error incase selected answers',
    message:
      'Selected answer(s) is not default correct answer(s). Please add explanation incase you ensure selected is correct answer(s) !',
  },
  {
    type: 'minLength',
    name: 'root',
    description: 'Error incase none selected answers',
    message: 'At least one checkbox has been checked',
  },
];

export default function ModifyQuestion(props: ICreateQuestion) {
  const { questionData } = props;
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isValidAnswer, setIsValidAnswer] = useState<boolean>(false);
  const [tab, setTabValue] = useState(0);

  const tempNotes = useRef<string | null>(null);

  const mapEditAnswer = () => {
    const { options, answers } = questionData;
    const mappedOpts = options?.map((option: string, index: number) => ({
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
      category: questionData.category,
      notes: questionData.notes,
      level: questionData.level,
      options: questionData.options,
      answers: questionData.answers,
    },
    resolver: yupResolver(createQuestionSchema),
  });
  const {
    setError,
    watch,
    getValues,
    setValue,
    formState: { isValid, errors },
  } = form;
  const questionType = watch('type');
  const notes = watch('notes');

  useEffect(() => {
    // Validate selected answer(s):
    const originalAnswers = questionData.answers?.sort().join(',');
    const selectedAnswers = answerArray
      ?.map((a, i) => (a.isCorrect ? i : null))
      .filter((a) => typeof a === 'number')
      .sort()
      .join(',');
    setIsValidAnswer(originalAnswers === selectedAnswers);
  }, [answerArray]);

  useEffect(() => {
    (() => {
      const resetAnswersSelected = answerArray?.map((answ) => ({
        ...answ,
        isCorrect: false,
      }));
      setAnswerArray(resetAnswersSelected);
    })();
  }, [questionType]);

  useEffect(() => {
    if (tempNotes.current) {
      setValue('notes', tempNotes.current);
      tempNotes.current = null;
    }
  });

  //#region : Handle interactive functions
  const HandleInteractions = {
    handleRedirect: (route: string) => {
      router.push(route);
    },
    handleModifiedQuestion: async (modifiedQuestion: IAddQuestion) => {
      // Payload data:
      const formData = {
        question: modifiedQuestion.question,
        description: modifiedQuestion.description,
        categories: modifiedQuestion.categories,
        category: getValues('category'),
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
        time: modifiedQuestion.time,
      };

      console.log('formData: ', formData, modifiedQuestion);

      // Executive handler data modified:
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
        const { type, name, message } = manualErrors[1];
        setError(name, {
          type: type,
          message: message,
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
    handleChange: (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
  };
  //#endregion

  const isDisabledSubmit = useMemo((): boolean => {
    const d = document.createElement('div');
    d.innerHTML = notes;
    const textContent = d.textContent || d.innerText;

    const _isValidated =
      !isValid ||
      (!isValidAnswer && !textContent?.length) ||
      isSubmitLoading ||
      questionType == QuestionType.CODING;

    return _isValidated;
  }, []);

  //#region : Create question form
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        className="h-[calc(100vh_-_250px)]"
        {...other}
      >
        {value === index && (
          <Box sx={{ px: 1, py: 4 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box>
      <Box className="mb-4 flex items-center justify-between">
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
          <Button
            color="primary"
            variant="contained"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(
              HandleInteractions.handleModifiedQuestion,
              (error) => console.log('submit error: ', error, getValues()),
            )}
            disabled={false}
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
        <Stack
          className="mt-4 h-[calc(100vh_-_220px)] gap-6"
          gridTemplateColumns={'1fr'}
          display={'grid'}
        >
          <Box className="configuration-group">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tab}
                onChange={HandleInteractions.handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Details" {...a11yProps(0)} />
                <Tab label="Description" {...a11yProps(1)} />
                <Tab label="Answers" {...a11yProps(2)} />
                <Tab label="Preview" {...a11yProps(3)} />
              </Tabs>
            </Box>
            {/* Details */}
            <CustomTabPanel value={tab} index={0}>
              <Stack
                gridTemplateColumns={'1fr'}
                display={'grid'}
                sx={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  border: 'solid 1px lightgrey',
                }}
              >
                <QuestionKind />
                <FormControl variant="standard" className="!w-9/12 pb-8">
                  <Typography className="mb-4 font-semibold">Title</Typography>
                  <CustomTextField
                    name="question"
                    customClass="ring-offset-0"
                    multiline
                    maxRows={3}
                    onKeyDown={(event) => {
                      if (event.keyCode === 13) {
                        event.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <Stack
                  gridTemplateColumns={'1fr 1fr 1fr'}
                  display={'grid'}
                  width={'60vw'}
                >
                  <AutocompleteDifficult controlName="level" />
                  <AutocompleteDuration controlName="time" />
                  <AutocompleteSkill controlName="category" />
                </Stack>
              </Stack>
            </CustomTabPanel>
            {/* Description*/}
            <CustomTabPanel value={tab} index={1}>
              <FormControl variant="standard" className="!w-9/12 pb-8 ">
                <RichTextArea
                  name="description"
                  data={getValues('description') || questionData?.description}
                  onChange={(val: string) => setValue('description', val)}
                />
              </FormControl>
            </CustomTabPanel>
            {/* Options / Explanation */}
            <CustomTabPanel value={tab} index={2}>
              <Stack
                className="gap-20"
                gridTemplateColumns={'1fr 1fr'}
                display={'grid'}
              >
                <Stack
                  className="basis-3/5 gap-2 md:overflow-y-auto "
                  flexDirection="column"
                  sx={{
                    height: 'calc(100vh - 320px)',
                    padding: '20px',
                  }}
                >
                  {questionType === QuestionType.CODING ||
                  questionType === QuestionType.LOGIC ? (
                    HandleInteractions.handleRenderCoding()
                  ) : (
                    <Box>
                      <RenderQuestionAnswers
                        questionType={questionType}
                        renderAnswers={answerArray}
                        error={errors['answers'] as any}
                        handleAnswers={(answers: IAnswer[]) => {
                          const correctIndx = answers.findIndex(
                            (answ: IAnswer) => answ.isCorrect,
                          );
                          setAnswerArray(answers);
                          setValue('answers', [correctIndx]);
                        }}
                      />
                    </Box>
                  )}
                </Stack>
                {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
                <FormControl variant="standard" className="!w-11/12 pb-7">
                  <Typography className="pb-4 font-semibold">
                    Notes / Explanation:
                  </Typography>
                  <RichTextArea
                    name="notes"
                    data={getValues('notes') || questionData?.notes}
                    onChange={(val: string) => {
                      tempNotes.current = val;
                    }}
                  />
                </FormControl>
              </Stack>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={3}>
              <QuestionPreview values={getValues()} />
            </CustomTabPanel>
          </Box>
        </Stack>
      </FormProvider>
    </Box>
  );
  //#endregion
}
