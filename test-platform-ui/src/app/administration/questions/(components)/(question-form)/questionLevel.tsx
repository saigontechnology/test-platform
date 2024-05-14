import CustomRadioGroup from '@/components/molecules/CustomRadioGroup';
import { QuestionLevel } from '@/libs/definitions';
import { ReactElement } from 'react';

const QuestionStandard = (): ReactElement => {
  return (
    <CustomRadioGroup
      label={'Standard'}
      controlName={'level'}
      options={QuestionLevel}
    />
  );
};

export default QuestionStandard;
