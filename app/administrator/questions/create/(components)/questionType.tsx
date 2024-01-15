import {
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ReactElement } from 'react';
import RenderQuestionTypeZone from './typezone';
import clsx from 'clsx';

interface IQuestionType {
  questionType: string | undefined;
  handleChangeQuestionType: (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string | undefined,
  ) => void;
}

export default function RenderQuestionType(props: IQuestionType): ReactElement {
  const { questionType, handleChangeQuestionType } = props;
  const questionTypes = ['single', 'multiple'];
  return (
    <FormControl>
      <Typography className="ml-2">Question Type</Typography>
      <ToggleButtonGroup
        value={questionType}
        exclusive
        onChange={handleChangeQuestionType}
        aria-label="text alignment"
        className="mx-2 my-2"
      >
        {questionTypes.map((type: string, indx: number) => {
          return (
            <ToggleButton
              key={`${type + indx}`}
              value={type}
              aria-label="left aligned"
              className={clsx({
                'active !bg-sky-100 !font-extrabold !text-blue-600':
                  questionType === type,
              })}
            >
              <Typography>{`${type} choice`}</Typography>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <RenderQuestionTypeZone questionType={questionType} />
    </FormControl>
  );
}
