'use client';

import React from 'react';

import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

interface IProps {
  options: string[];
  onSelect: (evt) => void;
}

const MultipleChoice: React.FC<any> = ({ options, onSelect }: IProps) => {
  return (
    <Box className="flex items-center gap-10">
      <FormGroup>
        {options?.map((opt, index) => (
          <FormControlLabel
            key={opt}
            control={<Checkbox value={index} onChange={onSelect} />}
            label={opt}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default MultipleChoice;
