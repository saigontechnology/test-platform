import { IOptions } from '@/components/atoms/CustomModules/AutocompleteTags';
import AutocompleteQFields from './autocompleteCommonFields';

interface IDuration extends IOptions {
  value: number;
  [k: string]: any;
}

const Durations: IDuration[] = [
  {
    name: '30s',
    value: 30000,
  },
  {
    name: '60s',
    value: 60000,
  },
  {
    name: '1 min, 30s',
    value: 90000,
  },
  {
    name: '2 mins',
    value: 120000,
  },
  {
    name: '3 mins',
    value: 180000,
  },
  {
    name: '5 mins',
    value: 300000,
  },
  {
    name: '10 mins',
    value: 600000,
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
    />
  );
}
