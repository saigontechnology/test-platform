import { IOptions } from '@/components/atoms/CustomModules/AutocompleteTags';
import AutocompleteQFields from './autocompleteCommonFields';

interface ISkill extends IOptions {
  value: string;
  [k: string]: any;
}

const ArraySkills: ISkill[] = [
  {
    name: 'React',
    value: 'REACT',
  },
  {
    name: 'Javascript',
    value: 'JAVASCRIPT',
  },
  {
    name: 'HTML',
    value: 'HTML',
  },
  {
    name: 'CSS',
    value: 'CSS',
  },
  {
    name: 'Typescript',
    value: 'TYPESCRIPT',
  },
  {
    name: 'Angular',
    value: 'ANGULAR',
  },
  {
    name: 'VueJS',
    value: 'VUE',
  },
];

export default function AutocompleteSkill({
  controlName,
}: {
  controlName: string;
}) {
  return (
    <AutocompleteQFields
      controlName={controlName}
      options={ArraySkills}
      label="Skill"
      singleMode={true}
    />
  );
}
