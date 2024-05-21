'use client';

import AutocompleteTags, {
  IOptions,
} from '@/components/atoms/CustomModules/AutocompleteTags';
import { FormControl, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface IDifficulty extends IOptions {
  value: string;
  [k: string]: any;
}

export default function AutocompleteQFields({
  controlName,
  options,
  label,
}: {
  controlName: string;
  options: any;
  label?: string;
}) {
  const { control, watch } = useFormContext();
  const { setValue, getValues } = useFormContext();
  const [selectedDifficult, setSelectedDifficult] = useState<IOptions[]>();
  const selectedOptLevel = watch(controlName);

  const mapData = () => {
    const selectedOpt: string = getValues(controlName),
      _selectedOptions = options.find(
        (lvl: IDifficulty) => lvl.value === selectedOpt,
      );
    _selectedOptions && setSelectedDifficult([_selectedOptions]);
  };

  useEffect(() => {
    mapData();
  }, [selectedOptLevel]);

  const handleAddItem = (item: IDifficulty) => {
    if (item) {
      setSelectedDifficult([item]);
      setValue(controlName, item.value);
    }
  };

  const handleRemoveItem = (items: IDifficulty[]) => {
    const updatedDurations = items.map((_i: IDifficulty) => _i.value);
    setSelectedDifficult(items);
    setValue(controlName, updatedDurations[0]);
  };

  return (
    <FormControl variant="standard" className="!w-11/12 pb-8">
      {label ? (
        <Typography className="mb-2 font-semibold">{label}</Typography>
      ) : null}
      <Controller
        name={controlName}
        control={control}
        render={({ field }) => {
          console.log(`${controlName}: `, getValues(controlName));
          return (
            <AutocompleteTags
              {...field}
              options={options}
              selectedItems={selectedDifficult ? selectedDifficult : []}
              addItem={(item) => handleAddItem(item as IDifficulty)}
              removeItem={(items) => handleRemoveItem(items as IDifficulty[])}
            />
          );
        }}
      />
    </FormControl>
  );
}
