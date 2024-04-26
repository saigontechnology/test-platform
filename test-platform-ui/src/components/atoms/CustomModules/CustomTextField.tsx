import { StandardTextFieldProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FieldError, useController, useFormContext } from 'react-hook-form';

interface ICustomTextField extends StandardTextFieldProps {
  name: string;
  customClass?: string;
}

export default function CustomTextField(props: ICustomTextField) {
  const { name, customClass } = props;
  const { control } = useFormContext();

  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });
  return (
    <TextField
      className={customClass}
      {...inputProps}
      {...props}
      error={invalid}
      helperText={invalid ? (error as FieldError)?.message : ''}
      variant="standard"
    />
  );
}
