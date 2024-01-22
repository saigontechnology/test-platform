import { StandardTextFieldProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FieldError, useController, useFormContext } from 'react-hook-form';

interface ICustomTextField extends StandardTextFieldProps {
  name: string;
}

export default function CustomTextField(props: ICustomTextField) {
  const { name } = props;
  const { control } = useFormContext();

  const {
    field: { ref, onChange, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });
  return (
    <TextField
      {...inputProps}
      {...props}
      error={invalid}
      helperText={invalid ? (error as FieldError)?.message : ''}
      variant="standard"
    />
  );
}
