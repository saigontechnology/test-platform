import { ReactElement, useEffect, useState } from 'react';
import { IAnswer } from '../page';
import { FormControl, Input } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import clsx from 'clsx';

interface ITypeZone {
  questionType: string | undefined,
  handleAnswers: (answers: IAnswer[]) => void
}

const initialAnswer = { id: 0, answer: '', isCorrect: false }

export default function RenderQuestionTypeZone(props: ITypeZone): ReactElement {
  const { questionType, handleAnswers } = props;
  const [answers, setAnswers] = useState<IAnswer[]>([
    initialAnswer
  ]);

  // Notes: Reset selected answers on 'questionType' changes.
  useEffect(() => {
    const resetAnswersSelected = answers.map(answ => ({...answ, isCorrect: false }))
    setAnswers(resetAnswersSelected);
  }, [questionType]);

  const updateStateAnswers = (updatedAnswers: IAnswer[]) => {
    setAnswers((prev) => {
      handleAnswers(updatedAnswers);
      return updatedAnswers
    });
  }

  const handleAnswerChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const modifiedAnswers = answers.map((answ: IAnswer) => {
      if (answ.id === +event.target.id.split('-')[1]) {
        return {
          ...answ,
          answer: event.target.value,
        };
      }
      return answ;
    });
    updateStateAnswers(modifiedAnswers);
  };
  
  const handleRemoveAnswer = (answer: IAnswer) => {
    const minusAnswers = [...answers];
    minusAnswers.splice(minusAnswers.indexOf(answer), 1);
    updateStateAnswers(minusAnswers);
  }

  const handleAddAnswer = () => {
    const modifiedAnswers = [...answers];
    modifiedAnswers[modifiedAnswers.length - 1].id = modifiedAnswers.length;
    modifiedAnswers.push(initialAnswer);
    updateStateAnswers(modifiedAnswers);
  }

  const renderAnswer = (answ: IAnswer, index: number): ReactElement => {
    return (
      <FormControl
        key={`answer-${answ.id}`}
        variant="standard"
        className="my-2 mx-2 inline-flex w-2/5 flex-row items-center"
      >
        { answ.id ? <input
          id="default-checkbox"
          type="checkbox"
          checked={answ.isCorrect}
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          onChange={(evt: any) => handleSelectCorrect(answ)}
        /> : null}
        <Input
          id={`answer-${answ.id}`}
          value={answ.answer}
          aria-describedby="component-helper-text"
          className="mx-2 my-2"
          placeholder={`Answer ${index + 1}`}
          onChange={handleAnswerChanges}
        />
        { !answ.id ? 
          <PlaylistAddIcon 
            className={clsx("w-6", {'cursor-pointer': answ.answer.length != 0})} 
            onClick={(evt: React.MouseEvent) => {
              evt.preventDefault();
              answ.answer.length != 0 && handleAddAnswer()
            }}
          /> 
          : <DeleteForeverIcon 
            className={clsx("w-6 cursor-pointer")} 
            onClick={(evt: React.MouseEvent) => {
              evt.preventDefault();
              handleRemoveAnswer(answ)
            }} 
          />
        }
      </FormControl>
    )
  }

  const handleSelectCorrect = (target: IAnswer) => {
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
    updateStateAnswers(updatedAnswers);
  };

  return (
    <>
      {questionType != undefined
        ? answers.map((answ: IAnswer, index: number) => {
            return index < 4 ? renderAnswer(answ, index) : null;
          })
        : null}
    </>
  );
}
