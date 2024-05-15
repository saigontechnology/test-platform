import { QuestionType } from '@/libs/definitions';
import { isStringHTML } from '@/libs/utils';
import { AddBox, Delete } from '@mui/icons-material';
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormHelperText,
  IconButton,
  Input,
  Typography,
} from '@mui/material';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { IAnswer } from '../modifyQuestion';

interface IQuestionAnswers {
  questionType: string | undefined;
  renderAnswers: IAnswer[];
  handleAnswers: (answers: IAnswer[]) => void;
  isModified: boolean;
}

// const manualErrors = [
//   {
//     type: 'manual',
//     name: 'root',
//     message: 'Selected answer(s) is not correct',
//   },
// ];

const initialAnswer = { id: '', answer: '', isCorrect: false };
const RenderQuestionAnswers = (props: IQuestionAnswers): ReactElement => {
  const { questionType, renderAnswers, handleAnswers, isModified } = props;

  const [answers, setAnswers] = useState<IAnswer[]>(
    renderAnswers.length ? renderAnswers : [initialAnswer],
  );

  const firstTimeRender = useRef<boolean>(true);

  const {
    // clearErrors,
    // setError,
    formState: { errors },
  } = useFormContext();

  // Notes: Reset selected answers on 'questionType' changes.
  useEffect(() => {
    if (firstTimeRender.current) {
      firstTimeRender.current = false;
      return;
    }

    HandleInteractions.handleResetAnswer();
  }, [questionType]);

  //#region : Handle interaction functions
  const HandleInteractions = {
    updateStateAnswers: (updatedAnswers: IAnswer[]) => {
      setAnswers(updatedAnswers);
      handleAnswers(updatedAnswers);
    },
    handleAnswerChanges: (event: React.ChangeEvent<HTMLInputElement>) => {
      const modifiedAnswers = answers.map((answer: IAnswer) => {
        if (answer.id === event.target.id) {
          return {
            ...answer,
            answer: event.target.value,
          };
        }
        return answer;
      });
      HandleInteractions.updateStateAnswers(modifiedAnswers);
    },
    handleRemoveAnswer: (answer: IAnswer) => {
      const minusAnswers = [...answers];
      minusAnswers.splice(minusAnswers.indexOf(answer), 1);
      if (minusAnswers.length < 4 && !minusAnswers.find((answ) => !answ.id)) {
        minusAnswers.push(initialAnswer);
      }
      HandleInteractions.updateStateAnswers(minusAnswers);
    },
    handleAddAnswer: () => {
      const modifiedAnswers = [...answers];
      modifiedAnswers[modifiedAnswers.length - 1].id = uuidv4();
      if (modifiedAnswers.length < 4) {
        modifiedAnswers.push(initialAnswer);
      }
      HandleInteractions.updateStateAnswers(modifiedAnswers);
    },
    handleSelectCorrect: async (target: IAnswer) => {
      const updatedAnswers = answers.map((answ: IAnswer) => {
        if (answ.id === target.id) {
          return {
            ...answ,
            isCorrect: !answ.isCorrect,
          };
        } else if (questionType === QuestionType.SINGLE_CHOICE) {
          return { ...answ, isCorrect: false };
        }
        return answ;
      });
      HandleInteractions.updateStateAnswers(updatedAnswers);
    },
    handleResetAnswer: () => {
      const resetAnswersSelected = answers.map((answ) => ({
        ...answ,
        isCorrect: false,
      }));
      HandleInteractions.updateStateAnswers(resetAnswersSelected);
    },
  };
  //#endregion

  //#region : Handle render answers
  const renderAnswer = (answ: IAnswer, index: number): ReactElement => {
    return (
      <FormControl
        key={`answer-${answ.id}`}
        variant="standard"
        className="-ml-3 inline-flex w-full !flex-row items-center"
      >
        <Checkbox
          checked={isModified ? answ.isCorrect : false} // Handle question edit on the first time.
          disabled={!answ.id}
          onClick={() => HandleInteractions.handleSelectCorrect(answ)}
        />
        {/** Notes: Specific cases answer include code patterns, simply envision the answer contents. */}
        <div>{String.fromCharCode(index + 'A'.charCodeAt(0))}</div>
        {isStringHTML(answ.answer) ? null : (
          <Input
            id={answ.id}
            value={answ.answer}
            aria-describedby="component-helper-text"
            placeholder={`Answer ${index + 1}`}
            onChange={HandleInteractions.handleAnswerChanges}
          />
        )}
        {answ.id ? (
          <IconButton
            color="error"
            onClick={() => HandleInteractions.handleRemoveAnswer(answ)}
            type="button"
          >
            <Delete />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            disabled={!answ.answer.trim().length}
            onClick={HandleInteractions.handleAddAnswer}
            type="button"
          >
            <AddBox />
          </IconButton>
        )}
      </FormControl>
    );
  };
  //#endregion

  return (
    <FormGroup className="gap-4">
      <Typography className="font-semibold">Options</Typography>
      {answers.map(renderAnswer)}
      {errors.root ? (
        <FormHelperText error>{errors.root.message}</FormHelperText>
      ) : null}
    </FormGroup>
  );
};

export default RenderQuestionAnswers;
