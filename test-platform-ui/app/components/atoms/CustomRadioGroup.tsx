import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
enum QuestionType {
  Single,
  Multiple,
  Text,
}

const QuestionTypeOptions = [
  {
    label: 'Single',
    value: QuestionType.Single,
  },
  {
    label: 'Multiple',
    value: QuestionType.Multiple,
  },
  {
    label: 'Text',
    value: QuestionType.Text,
  },
];

export default function CustomRadioGroup() {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Question Type</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        row
      >
        {QuestionTypeOptions.map((questionType, index) => (
          <FormControlLabel
            key={`question-type-${index}`}
            value={questionType.value}
            control={<Radio />}
            label={questionType.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
