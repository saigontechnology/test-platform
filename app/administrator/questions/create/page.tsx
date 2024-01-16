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
import CustomTextArea from '@/app/components/atoms/CustomTextArea';
export interface IAnswer {
  id: number;
  answer: string;
  isCorrect: boolean;
}

interface IQuestion {
  type: string
  title: string,
  content: string,
  answers: IAnswer[]
}

export default function CreateQuestion() {
  const [questionType, setQuestionType] = useState<string>('single');
  const questionObj = useRef<IQuestion>({
    type: questionType,
    title: '',
    content: '',
    answers: []
  })

  const handleQuestionType = (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string,
  ) => {
    event.preventDefault();
    setQuestionType((prevType) => 
      prevType != selectedType ? selectedType : prevType
    );
  };

  const handleAddQuestion = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    console.log('add question: ', {...questionObj.current, type: questionType})
  }

  //#region : Create question form
  return (
    <Box component="form" noValidate autoComplete="off" className="grid">
      <Typography className="text-2xl my-4 mb-10 mx-2" >Create a new question</Typography>
      <FormControl variant="standard" className="w-2/5 pb-7">
        <Typography className="ml-2">Title</Typography>
        <Input
          id="question-title-input"
          className="mx-2 my-2 ring-offset-0"
          onChange={(event: React.ChangeEvent<any>) => questionObj.current.title = event?.target.value}
        />
      </FormControl>
      <FormControl variant="standard" className="w-2/5 pb-7">
        <Typography className="ml-2">Content</Typography>
        <CustomTextArea 
          className="mx-2 my-2 w-full" 
          minRows={4} 
          handleTextChange={(event: React.ChangeEvent<any>) => questionObj.current.content = event?.target.value}
        />
      </FormControl>
      <RenderQuestionType 
        questionType={questionType} 
        handleChangeQuestionType={handleQuestionType}
        handleAnswers={(answers: IAnswer[]) => questionObj.current.answers = answers}
      />
      <Box className="footer action-buttons inline-flex gap-4 justify-end">
        <Button variant="contained" onClick={handleAddQuestion}>Add</Button>
        <Button variant="outlined">Cancel</Button>
      </Box>
    </Box>
  );
  //#endregion
}
