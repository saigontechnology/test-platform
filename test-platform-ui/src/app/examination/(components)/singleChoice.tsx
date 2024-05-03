'use client';

import React from 'react';

import { isStringHTML } from '@/libs/utils';
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
        {options?.map((opt, index) => {
          const _option = isStringHTML(opt) ? (
            <div dangerouslySetInnerHTML={{ __html: opt }} />
          ) : (
            opt
          );
          return (
            <FormControlLabel
              key={opt}
              control={<Radio value={index} onChange={onSelect} />}
              label={_option}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default SingleChoice;
