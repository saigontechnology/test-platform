import {
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { ReactElement } from 'react';
import { IAnswer } from '../modifyQuestion';
import RenderQuestionAnswers from './answers';

interface IQuestionType {
  answers?: IAnswer[];
  className?: string;
  questionType: string;
  handleAnswers: (answers: IAnswer[]) => void;
  handleChangeQuestionType: (
    event: React.MouseEvent<HTMLElement>,
    selectedType: string,
  ) => void;
}

const RenderQuestionType = (props: IQuestionType): ReactElement => {
  const {
    questionType,
    className,
    answers,
    handleAnswers,
    handleChangeQuestionType,
  } = props;

  // TODO: Have to define common Question_types
  const questionTypes = ['single', 'multiple'];

  return (
    <FormControl className={className}>
      <Typography className="ml-2 font-semibold">Type and Answers</Typography>
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
              size="small"
            >
              <Typography className="text-sm">{`${type} choice`}</Typography>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <RenderQuestionAnswers
        renderAnswers={answers}
        questionType={questionType}
        handleAnswers={(answers) =>
          handleAnswers(answers.filter((answ) => answ.id > -1))
        }
      />
    </FormControl>
  );
}

export default RenderQuestionType;
