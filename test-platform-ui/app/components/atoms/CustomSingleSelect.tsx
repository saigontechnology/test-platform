import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FieldError, useController, useFormContext } from 'react-hook-form';

interface IOption {
  label: string;
  value: string | number;
}
interface ICustomSingleSelect {
  label: string;
  options: IOption[];
  name: string;
  className?: string;
}

export default function CustomSingleSelect(props: ICustomSingleSelect) {
  const { label, options, name } = props;
  const { control } = useFormContext();

  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });

  return (
    <FormControl
      sx={{ m: 1, minWidth: 120 }}
      size="small"
      error={Boolean(error)}
    >
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        {...inputProps}
        {...props}
        labelId="demo-select-small-label"
        id="demo-select-small"
        label={label}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem key={`option-${index}`} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {invalid && (
        <FormHelperText>{(error as FieldError)?.message}</FormHelperText>
      )}
    </FormControl>
  );
}
