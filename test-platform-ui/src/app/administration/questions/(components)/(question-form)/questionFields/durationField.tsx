import { IOptions } from '@/components/atoms/CustomModules/AutocompleteTags';
import { formatTimeString } from '@/libs/utils';
import AutocompleteQFields from './autocompleteCommonFields';

interface IDuration extends IOptions {
  value: number;
  [k: string]: any;
}

const Durations: IDuration[] = [
  {
    name: formatTimeString(30),
    value: 30,
  },
  {
    name: formatTimeString(60),
    value: 60,
  },
  {
    name: formatTimeString(90),
    value: 90,
  },
  {
    name: formatTimeString(120),
    value: 120,
  },
  {
    name: formatTimeString(180),
    value: 180,
  },
  {
    name: formatTimeString(300),
    value: 300,
  },
  {
    name: formatTimeString(600),
    value: 600,
  },
];

export default function AutocompleteDuration({
  controlName,
}: {
  controlName: string;
}) {
  return (
    <AutocompleteQFields
      controlName={controlName}
      options={Durations}
      label="Expected duration (in minus.)"
      singleMode={true}
    />
  );
}
