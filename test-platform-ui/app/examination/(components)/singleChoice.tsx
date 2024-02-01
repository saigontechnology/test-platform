'use client';

import React from 'react';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

interface IProps {
  options: string[];
  onSelect: (evt: any) => void;
}

const SingleChoice: React.FC<any> = ({ options, onSelect }: IProps) => {
  return (
    <Box className="flex items-center gap-10 pt-5">
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Answers</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
        >
          {options?.map((opt, index) => (
            <FormControlLabel
              key={opt}
              control={<Radio value={index} onChange={onSelect} />}
              label={opt}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default SingleChoice;
