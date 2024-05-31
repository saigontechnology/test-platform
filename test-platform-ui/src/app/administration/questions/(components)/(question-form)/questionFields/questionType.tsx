import CustomRadioGroup from '@/components/molecules/CustomRadioGroup';
import { QuestionTypes } from '@/libs/definitions';
import { ReactElement } from 'react';

interface IQuestionKind {
  label?: string;
  handleOnChange?: (evt: React.MouseEvent | undefined) => void;
}

const QuestionKind = ({
  label,
  handleOnChange,
}: IQuestionKind): ReactElement => {
  return (
    <CustomRadioGroup
      label={label}
      controlName={'type'}
      options={QuestionTypes}
      handleOnClick={handleOnChange}
    />
  );
};

export default QuestionKind;
