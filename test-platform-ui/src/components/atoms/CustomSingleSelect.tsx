import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FieldError, useController, useFormContext } from 'react-hook-form';

interface IOption {
  label: string;
  value: string | number;
}
interface ICustomSingleSelect {
  options: IOption[];
  name: string;
  className?: string;
}

export default function CustomSingleSelect(props: ICustomSingleSelect) {
  const { options, name, ...others } = props;
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
      sx={{ flex: 1, margin: 0, minWidth: 120 }}
      size="small"
      error={Boolean(error)}
    >
      <Select
        {...inputProps}
        {...others}
        variant="standard"
        labelId="demo-select-small-label"
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
