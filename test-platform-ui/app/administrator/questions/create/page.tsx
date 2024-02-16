'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

const ModifyQuestion = dynamic(() => import('../(components)/modifyQuestion'), {
  ssr: false,
});

const CreateQuestion = () => {
  return (
    <Box>
      <ModifyQuestion />
    </Box>
  );
};

export default CreateQuestion;
