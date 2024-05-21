'use client';

import React from 'react';

import { Box, Typography } from '@mui/material';

interface IProps {
  order: number;
  question: any;
}

const Question: React.FC<IProps> = ({ order, question }) => {
  return (
    <Box className="grid items-center gap-10">
      <Typography variant="h6">
        Question {order}: {question.question}
      </Typography>
      <Box
        component="div"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />
    </Box>
  );
};

export default Question;
