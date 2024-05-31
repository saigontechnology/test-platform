'use client';

import { IOptions } from '@/components/atoms/CustomModules/AutocompleteTags';
import { QuestionLevels } from '@/libs/definitions';
import AutocompleteQFields from './autocompleteCommonFields';

export interface IDifficulty extends IOptions {
  value: string;
  [k: string]: any;
}

const Difficulty: IDifficulty[] = [
  {
    name: 'Junior',
    value: QuestionLevels.JUNIOR,
  },
  {
    name: 'Intermediate',
    value: QuestionLevels.INTERMEDIATE,
  },
  {
    name: 'Senior',
    value: QuestionLevels.SENIOR,
  },
  {
    name: 'Principal',
    value: QuestionLevels.PRINCIPAL,
  },
];

export default function AutocompleteDifficult({
  controlName,
}: {
  controlName: string;
}) {
  return (
    <AutocompleteQFields
      controlName={controlName}
      options={Difficulty}
      label="Difficult"
      singleMode={true}
    />
  );
}
