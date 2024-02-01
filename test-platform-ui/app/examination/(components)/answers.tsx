'use client';

import React from 'react';

import { Box, Typography } from '@mui/material';

interface IProps {
  index: number;
  question: string;
}

const Answers: React.FC<IProps> = ({ index, question }) => {
  return (
    <Box className="flex items-center gap-10">
      <Typography variant="h5">Question {index}:</Typography>
      <Typography variant="h6">{question}</Typography>
    </Box>
  );
};

export default Answers;
