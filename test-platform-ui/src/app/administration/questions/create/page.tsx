'use client';

import { QuestionType } from '@/libs/definitions';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

const ModifyQuestion = dynamic(() => import('../(components)/modifyQuestion'), {
  ssr: false,
});

const CreateQuestion = () => {
  return (
    <Box>
      <ModifyQuestion
        questionData={{
          id: 0,
          question: '',
          description: '',
          notes: '',
          level: '',
          categories: [],
          category: '',
          answers: [],
          options: [],
          type: QuestionType.SINGLE_CHOICE,
          isModified: true,
          duration: 0,
        }}
      />
    </Box>
  );
};

export default CreateQuestion;
