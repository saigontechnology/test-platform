'use client';

import React from 'react';

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

interface IProps {
  options: string[];
  onSelect: (evt: any) => void;
}

const SingleChoice: React.FC<any> = ({ options, onSelect }: IProps) => {
  return (
    <FormControl>
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
  );
};

export default SingleChoice;
