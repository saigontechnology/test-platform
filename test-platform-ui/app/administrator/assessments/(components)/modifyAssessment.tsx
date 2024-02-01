'use client';

import CustomSingleSelect from '@/app/components/atoms/CustomSingleSelect';
import CustomTextField from '@/app/components/atoms/CustomTextField';
import { ICreateAssessment, LevelOptions } from '@/app/constants/assessments';
import { IResponseQuestion } from '@/app/constants/questions';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { showNotification } from '@/app/lib/toast';
import { createAssessmentSchema } from '@/app/validations/assessment';
import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddBox, Delete } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { IQuestion } from '../../questions/page';

interface IModifyAssessment {
  detail?: any;
}

export default function ModifyAssessment(props: IModifyAssessment) {
  const { detail } = props;
  const router = useRouter();
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);

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
      name: detail?.name,
      level: detail?.level,
      questions: [''],
    },
    resolver: yupResolver(createAssessmentSchema),
  });
  const { control, watch } = form;

  const { append, remove } = useFieldArray<any>({
    control,
    name: 'questions',
  });

  const questions = watch('questions');

  const handleAddNew = async () => {
    const formData = form.getValues();
    const { error } = await ApiHook(Methods.POST, '/assessments', {
      data: formData,
    });
    !error && showNotification('Create new assessment successfully', 'success');
  };

  const questionOptions = useMemo(() => {
    return questionList.map((item) => ({
      label: item.title,
      value: item.id,
    }));
  }, [questionList]);

  return (
    <Box>
      <FormProvider {...form}>
        <Typography className="mx-2 my-4 mb-10 text-2xl">
          {`${detail ? 'Edit' : 'New'} Assessment`}
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-row"
          onSubmit={form.handleSubmit(handleAddNew)}
        >
          <Box className="grid basis-1/2">
            <FormControl variant="standard" className="!w-4/5 pb-7">
              <Typography className="ml-2 font-semibold">Name</Typography>
              <CustomTextField
                name="name"
                id="question-title-input"
                className="mx-2 my-2 ring-offset-0"
              />
            </FormControl>
            <FormControl variant="standard" className="!w-4/5 pb-7">
              <Typography className="ml-2 font-semibold">Level</Typography>
              <CustomSingleSelect
                label="Level"
                name="level"
                options={LevelOptions}
              />
            </FormControl>
            <Box>
              <Typography className="ml-2 font-semibold">Questions</Typography>
              <Grid container>
                {(questions || []).map((_, index) => (
                  <Grid
                    key={`question-${index}`}
                    item
                    xs={12}
                    className="flex items-center"
                  >
                    <CustomSingleSelect
                      label="Level"
                      name={`questions.${index}`}
                      options={questionOptions}
                      className="w-[200px]"
                    />
                    <IconButton onClick={() => append('')}>
                      <AddBox />
                    </IconButton>
                    {index > 0 && (
                      <IconButton onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
        <ButtonGroup className="footer action-buttons inline-flex w-full justify-end gap-2">
          <Button
            variant="contained"
            startIcon={<LibraryAddIcon />}
            onClick={form.handleSubmit(handleAddNew)}
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
}
