import CustomRadioGroup from '@/components/molecules/CustomRadioGroup';
import { QuestionTypes } from '@/libs/definitions';
import { ReactElement } from 'react';

const QuestionKind = (): ReactElement => {
  return (
    <CustomRadioGroup
      label={'Type'}
      controlName={'type'}  
      options={QuestionTypes}
    />
  );
};

export default QuestionKind;
