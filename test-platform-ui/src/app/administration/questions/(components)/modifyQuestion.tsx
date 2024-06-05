'use client';

import CustomTextField from '@/components/atoms/CustomModules/CustomTextField';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { IAddQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { showNotification } from '@/libs/toast';
import { createQuestionSchema } from '@/validations/questions';
// import { DevTool } from '@hookform/devtools';
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
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import RenderQuestionAnswers2 from './(question-form)/answers/answers_v2';
import { QuestionPreview } from './(question-form)/preview';
import AutocompleteDifficult from './(question-form)/questionFields/difficultyField';
import AutocompleteDuration from './(question-form)/questionFields/durationField';
import QuestionKind from './(question-form)/questionFields/questionType';
import AutocompleteSkill from './(question-form)/questionFields/skillField';
import { ICreateQuestion, TabPanelProps, manualErrors } from './models';

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
      <Box sx={{ px: 1, py: 4 }}>
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ModifyQuestion(props: ICreateQuestion) {
  const { questionData } = props;
  const router = useRouter();
  const [_isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [_isValidAnswer, _setIsValidAnswer] = useState<boolean>(false);
  const [tab, setTabValue] = useState(0);

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
      duration: questionData.duration,
    },
    resolver: yupResolver(createQuestionSchema),
  });
  const {
    setError,
    // control,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = form;

  //#region : Handle interactive functions
  const HandleInteractions = {
    handleRedirect: (route: string) => {
      router.push(route);
    },
    handleModifiedQuestion: async (modifiedQuestion: IAddQuestion) => {
      if (!isValid) {
        return;
      }
      // Payload data:
      const formData = {
        question: modifiedQuestion.question,
        description: modifiedQuestion.description,
        categories: modifiedQuestion.categories.concat(getValues('category')),
        category: getValues('category'),
        level: modifiedQuestion.level,
        type: modifiedQuestion.type,
        answer: getValues('answers'),
        options: getValues('options'),
        notes: modifiedQuestion.notes,
        isModified: true,
        duration: modifiedQuestion.duration,
      };

      // Executive handler data modified:
      if (formData.answer.length) {
        setIsSubmitLoading(true);
        const { error } = await (questionData.id
          ? ApiHook(Methods.PUT, `/admin/questions/${questionData.id}`, {
              data: formData,
            })
          : ApiHook(Methods.POST, '/admin/questions', {
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
    handleChange: (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
  };
  //#endregion

  //#region : Create question form
  return (
    <Box>
      <Box className="mb-4 flex items-center justify-between">
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2 pr-2">
          <Button
            variant="contained"
            className="!bg-primary text-base"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(
              HandleInteractions.handleModifiedQuestion,
              (error) => {
                console.log('isValid form: ', isValid);
                console.log('submit error: ', error, getValues());
              },
            )}
            disabled={false}
          >
            Submit
          </Button>
          <Button
            className="border-primary text-base"
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
                onChange={(event: any, value: any) =>
                  HandleInteractions.handleChange(event, value)
                }
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
                <QuestionKind
                  label="Question Type"
                  handleOnChange={() => setValue('answers', new Array())}
                />
                <Stack
                  gridTemplateColumns={'1fr 1fr 1fr'}
                  display={'grid'}
                  width={'60vw'}
                >
                  <AutocompleteDifficult controlName="level" />
                  <AutocompleteDuration controlName="duration" />
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
                  <RenderQuestionAnswers2
                    renderAnswers={getValues('options')}
                    correctAnswers={getValues('answers')}
                    error={errors['answers'] as any}
                  />
                </Stack>
                <FormControl variant="standard" className="!w-11/12 pb-7">
                  <Typography className="pb-4 font-semibold">
                    Notes / Explanation:
                  </Typography>
                  <RichTextArea
                    name="notes"
                    data={getValues('notes') || questionData?.notes}
                    onChange={(val: string) => {
                      setValue('notes', val);
                    }}
                  />
                </FormControl>
              </Stack>
            </CustomTabPanel>
            {/* Preview */}
            <CustomTabPanel value={tab} index={3}>
              {tab === 3 ? <QuestionPreview /> : null}
            </CustomTabPanel>
          </Box>
        </Stack>
      </FormProvider>
      {/* <DevTool control={control} /> */}
    </Box>
  );
  //#endregion
}
