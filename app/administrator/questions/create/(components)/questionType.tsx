import {
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ReactElement } from 'react';
import RenderQuestionTypeZone from './typezone';
import clsx from 'clsx';
import { IAnswer } from '../page';

interface IQuestionType {
  questionType: string,
  handleAnswers: (answers: IAnswer[]) => void,
  handleChangeQuestionType: (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string,
  ) => void;
}

export default function RenderQuestionType(props: IQuestionType): ReactElement {
  const { questionType, handleAnswers, handleChangeQuestionType } = props;
  const questionTypes = ['single', 'multiple'];
  return (
    <FormControl>
      <Typography className="ml-2">Type and Answers</Typography>
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
              className={clsx('my-2', {
                'active !bg-sky-100 !font-extrabold !text-blue-600':
                  questionType === type,
              })}
              size='small'
            >
              <Typography className='text-sm'>{`${type} choice`}</Typography>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <RenderQuestionTypeZone questionType={questionType} handleAnswers={(answers) => handleAnswers(answers.filter(answ => answ.id != 0))} />
    </FormControl>
  );
}
