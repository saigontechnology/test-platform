import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface IRadioGroup {
  label?: string;
  controlName: string;
  options: {
    label: string;
    value: any;
  }[];
  handleOnClick?: (evt: React.MouseEvent | undefined) => void;
}

const CustomRadioGroup = ({
  label,
  controlName,
  options,
  handleOnClick,
}: IRadioGroup): ReactElement => {
  const { control } = useFormContext();

  return (
    <FormControl className="gap-4 pb-4">
      {label?.length ? (
        <Typography className="font-semibold">{label}</Typography>
      ) : null}
      <Controller
        name={controlName}
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    onClick={(evt: React.MouseEvent | undefined) =>
                      handleOnClick && handleOnClick(evt)
                    }
                  />
                }
                label={option.label}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default CustomRadioGroup;
