import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
enum Category {
  React,
  Typescript,
  Javascript,
  Golang,
  ReactNative,
}

const CategoriesOptions = [
  {
    label: 'React',
    value: Category.React,
  },
  {
    label: 'React Native',
    value: Category.ReactNative,
  },
  {
    label: 'Typescript',
    value: Category.React,
  },
  {
    label: 'Javascript',
    value: Category.Javascript,
  },
  {
    label: 'Golang',
    value: Category.Golang,
  },
];

export default function CustomSingleSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Category</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Category"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {CategoriesOptions.map((category, index) => (
          <MenuItem key={`category-${index}`} value={category.value}>
            {category.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
