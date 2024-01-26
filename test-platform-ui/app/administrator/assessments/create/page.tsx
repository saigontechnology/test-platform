'use client';

import CustomSingleSelect from '@/app/components/atoms/CustomSingleSelect';
import CustomTextField from '@/app/components/atoms/CustomTextField';
import { ICreateAssessment, LevelOptions } from '@/app/constants/assessments';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { createAssessmentSchema } from '@/app/validations/assessment';
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
import { FormProvider, useForm } from 'react-hook-form';

interface ICreatePage {
  detail: any;
}

export default function CreatePage(props: ICreatePage) {
  const { detail } = props;
  const router = useRouter();

  const form = useForm<ICreateAssessment>({
    defaultValues: {
      name: detail?.name,
      level: detail?.level,
    },
    resolver: yupResolver(createAssessmentSchema),
  });
  const { control } = form;

  const handleAddNew = async () => {
    const formData = form.getValues();
    await ApiHook(Methods.POST, '/assessments', {
      data: formData,
    });
  };

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
