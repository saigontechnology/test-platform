'use client';

import RichTextArea from '@/components/atoms/Editor/richtext';
import { ICreateAssessment } from '@/constants/assessments';
import { IResponseQuestion } from '@/constants/questions';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { showNotification } from '@/libs/toast';
import { createAssessmentSchema } from '@/validations/assessment';
import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { IQuestion } from '../../questions/page';
interface IModifyAssessment {
  detail?: any;
}

export default function ModifyAssessment(props: IModifyAssessment) {
  const { detail } = props;
  const router = useRouter();
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  useEffect(() => {
    getQuestionsList();
  }, []);

  const getQuestionsList = async () => {
    const _questions = await ApiHook(Methods.GET, '/questions');
    const _questionList: IQuestion[] = (
      _questions.data as Array<IResponseQuestion>
    ).map((q: IResponseQuestion) => {
      return {
        id: q.id,
        title: q.question,
        content: q.description,
        categories: new Array().concat(q.category),
        answers: q.answer,
        options: q.options,
        type: q.type,
      };
    });
    setQuestionList(_questionList);
  };

  const form = useForm<ICreateAssessment>({
    defaultValues: {
      name: '',
      level: '',
      questions: [''],
    },
    resolver: yupResolver(createAssessmentSchema),
  });
  const { control, watch } = form;

  useEffect(() => {
    if (!!detail) {
      const { assessmentQuestionMapping, id, level, name } = detail;
      const questions = assessmentQuestionMapping.map(
        (item: any) => item.question.id,
      );
      form.reset((prevState) => ({
        ...prevState,
        id,
        level,
        name,
        questions: questions.length ? questions : prevState.questions,
      }));
    }
  }, [detail]);

  const { append, remove } = useFieldArray<any>({
    control,
    name: 'questions',
  });

  const questions = watch('questions');

  const submit = () => {
    setIsSubmitLoading(true);
    if (!!detail?.id) {
      handleEdit();
    } else {
      handleAddNew();
    }
  };

  const handleAddNew = async () => {
    const formData = form.getValues();
    const { error } = await ApiHook(Methods.POST, '/assessments', {
      data: formData,
    });
    setIsSubmitLoading(false);
    if (!error) {
      showNotification('Create new assessment successfully', 'success');
      router.back();
    }
  };

  const handleEdit = async () => {
    const formData = form.getValues();
    const { error } = await ApiHook(Methods.PUT, `/assessments/${detail.id}`, {
      data: formData,
    });
    setIsSubmitLoading(false);
    if (!error) {
      showNotification('Update assessment successfully', 'success');
      router.back();
    }
  };

  const questionOptions = useMemo(() => {
    return questionList.map((item) => ({
      label: item.title,
      value: item.id,
    }));
  }, [questionList]);

  return (
    // <Box sx={{ overflow: 'auto' }}>
    //   <Box className="flex items-center justify-between">
    //     <Typography component="h1" className={`mb-10 text-xl md:text-2xl`}>
    //       {detail ? 'Edit' : 'New'} Assessment
    //     </Typography>
    //   </Box>
    //   <FormProvider {...form}>
    //     <Box
    //       component="form"
    //       noValidate
    //       autoComplete="off"
    //       className="flex flex-row"
    //     >
    //       <Box className="!w-1/2">
    //         <FormControl variant="standard" className="!w-11/12 pb-7">
    //           <Typography className="font-semibold">Name</Typography>
    //           <CustomTextField
    //             name="name"
    //             id="question-title-input"
    //             className="full-width ring-offset-0"
    //             multiline
    //             maxRows={5}
    //             onKeyDown={(event) => {
    //               if (event.key === 'Enter') {
    //                 event.preventDefault();
    //               }
    //             }}
    //           />
    //         </FormControl>
    //         <FormControl variant="standard" className="!w-11/12 pb-7">
    //           <Typography className="font-semibold">Level</Typography>
    //           <CustomSingleSelect name="level" options={LevelOptions} />
    //         </FormControl>
    //         <FormGroup className="!w-11/12 pb-7">
    //           <Typography className="font-semibold">Questions</Typography>
    //           <Box sx={{ overflowY: 'auto', maxHeight: 300, width: '100%' }}>
    //             {(questions || []).map((question, index) => (
    //               <Stack
    //                 key={`question-${question}`}
    //                 alignItems="center"
    //                 justifyContent="flex-start"
    //                 direction="row"
    //                 gap={1}
    //               >
    //                 <Typography className="font-semibold">
    //                   {index + 1}.
    //                 </Typography>
    //                 <CustomSingleSelect
    //                   name={`questions.${index}`}
    //                   options={questionOptions}
    //                 />
    //                 <IconButton
    //                   color="primary"
    //                   onClick={() => append('')}
    //                   sx={{
    //                     display:
    //                       index + 1 === questions?.length ? 'block' : 'none',
    //                   }}
    //                 >
    //                   <AddBox />
    //                 </IconButton>
    //                 <IconButton
    //                   color="error"
    //                   onClick={() => remove(index)}
    //                   disabled={questions?.length === 1}
    //                 >
    //                   <Delete />
    //                 </IconButton>
    //               </Stack>
    //             ))}
    //           </Box>
    //         </FormGroup>
    //       </Box>
    //     </Box>
    //     <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
    //       <Button
    //         variant="contained"
    //         startIcon={<LibraryAddIcon />}
    //         onClick={form.handleSubmit(submit)}
    //         disabled={isSubmitLoading}
    //       >
    //         Submit
    //       </Button>
    //       <Button
    //         variant="outlined"
    //         startIcon={<ClearIcon />}
    //         onClick={() => router.back()}
    //       >
    //         Cancel
    //       </Button>
    //     </ButtonGroup>
    //     <DevTool control={control} />
    //   </FormProvider>
    // </Box>`
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="mr-2 font-medium">Assessment Name</span>
              <EditIcon sx={{ fontSize: 18 }} />
            </div>
            <button>
              <AddIcon sx={{ fontSize: 20 }} />
              <span className="ml-2 text-sm">Add questions</span>
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-400">Level</span>
              <span className="ml-2 text-sm">Intermediate</span>
            </div>
            <div>
              <span className="text-sm text-gray-400">Number of questions</span>
              <span className="ml-2 text-sm">0</span>
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh_-_201px)] overflow-y-scroll pt-4">
          <div className="text-sm text-gray-400">Question</div>
          {questionList.map((question, index) => {
            return (
              <div className="mt-4 flex items-center pr-4">
                <div className="px-4 text-sm text-gray-400">#{index + 1}</div>
                <div className="w-full rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <RichTextArea
                    key="questionDescriptionPreview"
                    name="notes"
                    data={question.content}
                    isReadOnly={true}
                  />
                </div>
              </div>
            );
          })}
          <div></div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        Preview
      </div>
    </div>
  );
}
