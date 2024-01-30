import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { FormControl, Input } from '@mui/material';
import clsx from 'clsx';
import { ReactElement, useEffect, useState } from 'react';
import { IAnswer } from '../modifyQuestion';

interface IQuestionAnswers {
  questionType: string | undefined;
  renderAnswers?: IAnswer[];
  handleAnswers: (answers: IAnswer[]) => void;
}

const initialAnswer = { id: -1, answer: '', isCorrect: false };
const RenderQuestionAnswers = (props: IQuestionAnswers): ReactElement => {
  const { questionType, renderAnswers, handleAnswers } = props;
  const [firstEditRender, setFirstEditRender] = useState<boolean>(true);
  const [answers, setAnswers] = useState<IAnswer[]>(
    renderAnswers?.length ? renderAnswers : [initialAnswer],
  );

  // Notes: Reset selected answers on 'questionType' changes.
  useEffect(() => {
    if (firstEditRender) {
      setFirstEditRender(false);
      return;
    }
    const resetAnswersSelected = answers.map((answ) => ({
      ...answ,
      isCorrect: false,
    }));
    setAnswers(resetAnswersSelected);
  }, [questionType]);

  //#region : Handle interaction functions
  const HandleInteractions = {
    updateStateAnswers: (updatedAnswers: IAnswer[]) => {
      setAnswers((prev) => {
        handleAnswers(updatedAnswers);
        return updatedAnswers;
      });
    },
    handleAnswerChanges: (event: React.ChangeEvent<HTMLInputElement>) => {
      const modifiedAnswers = answers.map((answ: IAnswer) => {
        if (answ.id === +event.target.id.split('_')[1]) {
          return {
            ...answ,
            answer: event.target.value,
          };
        }
        return answ;
      });
      HandleInteractions.updateStateAnswers(modifiedAnswers);
    },
    handleRemoveAnswer: (answer: IAnswer) => {
      const minusAnswers = [...answers];
      minusAnswers.splice(minusAnswers.indexOf(answer), 1);
      if (minusAnswers.length < 4) {
        minusAnswers.push(initialAnswer);
      }
      HandleInteractions.updateStateAnswers(minusAnswers);
    },
    handleAddAnswer: () => {
      const modifiedAnswers = [...answers];
      modifiedAnswers[modifiedAnswers.length - 1].id = modifiedAnswers.length;
      if (modifiedAnswers.length < 4) {
        modifiedAnswers.push(initialAnswer);
      }
      HandleInteractions.updateStateAnswers(modifiedAnswers);
    },
    handleSelectCorrect: (target: IAnswer) => {
      const updatedAnswers = answers.map((answ: IAnswer) => {
        if (answ.id === target.id) {
          return {
            ...answ,
            isCorrect: !answ.isCorrect,
          };
        } else if (questionType === 'single') {
          return { ...answ, isCorrect: false };
        }
        return answ;
      });
      HandleInteractions.updateStateAnswers(updatedAnswers);
    },
  };
  //#endregion

  //#region : Handle render answers
  const renderAnswer = (answ: IAnswer, index: number): ReactElement => {
    return (
      <FormControl
        key={`answer-${answ.id}`}
        variant="standard"
        className="mx-2 my-2 inline-flex w-2/5 flex-row items-center"
      >
        {answ.id > -1 ? (
          <input
            id="default-checkbox"
            type="checkbox"
            checked={answ.isCorrect}
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            onChange={(evt: any) =>
              HandleInteractions.handleSelectCorrect(answ)
            }
          />
        ) : null}
        <Input
          id={`answer_${answ.id}`}
          value={answ.answer}
          aria-describedby="component-helper-text"
          className="mx-2 my-2"
          placeholder={`Answer ${index + 1}`}
          onChange={HandleInteractions.handleAnswerChanges}
        />
        {answ.id > -1 ? (
          <DeleteForeverIcon
            className={clsx('w-6 cursor-pointer')}
            onClick={(evt: React.MouseEvent) => {
              evt.preventDefault();
              HandleInteractions.handleRemoveAnswer(answ);
            }}
          />
        ) : (
          <PlaylistAddIcon
            className={clsx('w-6', {
              'cursor-pointer ': answ.answer.length != 0,
            })}
            onClick={(evt: React.MouseEvent) => {
              evt.preventDefault();
              answ.answer.length != 0 && HandleInteractions.handleAddAnswer();
            }}
          />
        )}
      </FormControl>
    );
  };
  //#endregion

  return (
    <>
      {questionType != undefined
        ? answers.map((answ: IAnswer, index: number) => {
            return index < 4 ? renderAnswer(answ, index) : null;
          })
        : null}
    </>
  );
};

export default RenderQuestionAnswers;
