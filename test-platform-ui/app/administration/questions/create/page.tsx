'use client';

import { QuestionType } from '@/app/constants/assessments';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

const ModifyQuestion = dynamic(() => import('../(components)/modifyQuestion'), {
  ssr: false,
});

const CreateQuestion = () => {
  return (
    <Box>
      <ModifyQuestion questionData={{
        id: 0,
        question: "",
        description: "",
        categories: [],
        answers: [],
        options: [],
        type: QuestionType.SINGLE_CHOICE,
      }} />
    </Box>
  );
};

export default CreateQuestion;
