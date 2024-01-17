import { StandardTextFieldProps } from '@mui/material';
import TextField from '@mui/material/TextField';

interface ICustomTextField extends StandardTextFieldProps {}

export default function CustomTextField(props: ICustomTextField) {
  return <TextField variant="standard" {...props} />;
}
