'use client';

import React from 'react';

import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

interface IProps {
  options: string[];
  onSelect: (evt: any) => void;
}

const MultipleChoice: React.FC<any> = ({ options, onSelect }: IProps) => {
  return (
    <FormGroup>
      {options?.map((opt, index) => (
        <FormControlLabel
          key={opt}
          control={<Checkbox value={index} onChange={onSelect} />}
          label={opt}
        />
      ))}
    </FormGroup>
  );
};

export default MultipleChoice;
