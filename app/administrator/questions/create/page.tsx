/* eslint-disable @next/next/no-async-client-component */
'use client';

import {
  Box,
  Button,
  FormControl,
  Input,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useRef } from 'react';
import RenderQuestionType from './(components)/questionType';

export interface IAnswer {
  id: number;
  answer: string;
  isCorrect: boolean;
}

export default function CreateQuestion() {
  const [questionType, setQuestionType] = useState<string | undefined>(
    'single',
  );
  const cb = useRef<any>();

  const handleQuestionTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event?.target.value);
  };

  const handleQuestionContent = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(event?.target.value);
  };

  const handleQuestionType = (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string | undefined,
  ) => {
    event.preventDefault();
    setQuestionType((prevType) => {
      if (prevType != selectedType) {
        return selectedType;
      }
    });
  };

  //#region : Create question form
  return (
    <Box component="form" noValidate autoComplete="off" className="grid">
      <FormControl variant="standard" className="w-2/5 pb-7">
        <Typography className="ml-2">Question Title</Typography>
        <Input
          id="component-helper"
          defaultValue=""
          aria-describedby="component-helper-text"
          className="mx-2 my-2"
          onChange={handleQuestionTitle}
        />
      </FormControl>
      <FormControl variant="standard" className="w-2/5 pb-7">
        <Typography className="ml-2">Question Content</Typography>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={5}
          fullWidth
          className="mx-2 my-2 w-full"
          onChange={handleQuestionContent}
        />
      </FormControl>
      <RenderQuestionType questionType={questionType} handleChangeQuestionType={handleQuestionType} />
      <Box className="footer action-buttons inline-flex gap-4 justify-end">
        <Button variant="contained">Add</Button>
        <Button variant="outlined">Cancel</Button>
      </Box>
    </Box>
  );
  //#endregion
}
