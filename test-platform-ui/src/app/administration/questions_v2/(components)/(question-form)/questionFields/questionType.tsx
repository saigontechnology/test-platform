import CustomRadioGroup from '@/components/molecules/CustomRadioGroup';
import { QuestionTypes } from '@/libs/definitions';
import { ReactElement } from 'react';

interface IQuestionKind {
  label?: string;
}

const QuestionKind = ({ label }: IQuestionKind): ReactElement => {
  return (
    <CustomRadioGroup
      label={label}
      controlName={'type'}
      options={QuestionTypes}
    />
  );
};

export default QuestionKind;
