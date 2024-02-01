'use client';

import React from 'react';

import { Box, Typography } from '@mui/material';

interface IProps {
  order: number;
  question: string;
}

const Question: React.FC<IProps> = ({ order, question }) => {
  return (
    <Box className="flex items-center gap-10">
      <Typography>
        <strong>Question {order}:</strong> {question}
      </Typography>
    </Box>
  );
};

export default Question;
