import { StandardTextFieldProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FieldError, useController, useFormContext } from 'react-hook-form';

interface ICustomTextField extends StandardTextFieldProps {
  name: string;
  customClass?: string;
  isReadOnly?: boolean;
}

export default function CustomTextField(props: ICustomTextField) {
  const { name, customClass, isReadOnly = false } = props;
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
      {...props}
      InputProps={{
        ...inputProps,
        readOnly: isReadOnly,
        disableUnderline: isReadOnly,
      }}
      error={invalid}
      helperText={invalid ? (error as FieldError)?.message : ''}
      variant="standard"
    />
  );
}
