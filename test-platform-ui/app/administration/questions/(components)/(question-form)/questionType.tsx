import { QuestionTypeOptions } from '@/app/constants/assessments';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const RenderQuestionType = (): ReactElement => {
  const { control } = useFormContext();

  return (
    <FormControl>
      <Typography className="font-semibold">Type</Typography>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <RadioGroup
            row
            {...field}
          >
            {
              QuestionTypeOptions.map((option) => (<FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />))
            }
          </RadioGroup>
        )}
      />
    </FormControl>
  );
}

export default RenderQuestionType;
