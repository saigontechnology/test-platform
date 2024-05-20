'use client';

import RichTextArea from '@/components/atoms/Editor/richtext';
import { QuestionType } from '@/libs/definitions';
import { AddBox, Delete } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  Checkbox,
  FormControl,
  FormGroup,
  FormHelperText,
  IconButton,
  Typography,
} from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { IAnswer } from '../modifyQuestion';

interface IQuestionAnswers {
  questionType: string | undefined;
  renderAnswers: IAnswer[];
  error?:
    | {
        type: string;
        message: string;
      }
    | any;
}

const initialAnswer = { id: '', answer: '', isCorrect: false };
const RenderQuestionAnswers = (props: IQuestionAnswers): ReactElement => {
  const { questionType, renderAnswers, error } = props;

  const [answers, setAnswers] = useState<IAnswer[]>(
    renderAnswers.length ? renderAnswers : [initialAnswer],
  );

  const {
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    HandleInteractions.updateStateAnswers(renderAnswers);
  }, [renderAnswers]);

  //#region : Handle interaction functions
  const HandleInteractions = {
    updateStateAnswers: (updatedAnswers: IAnswer[]) => {
      setAnswers(updatedAnswers);
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
    handleSelectCorrect: (target: IAnswer) => {
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
  };
  //#endregion

  //#region : Handle render answers
  const renderAnswer = (answ: IAnswer, _index: number): ReactElement => {
    return (
      <FormControl
        key={`answer-${answ.id}`}
        variant="standard"
        className="-ml-3 inline-flex w-full !flex-row items-center"
      >
        <Checkbox
          checked={answ.isCorrect}
          disabled={!answ.id}
          onClick={() => HandleInteractions.handleSelectCorrect(answ)}
        />
        {/** Notes: Specific cases answer include code patterns, simply envision the answer contents. */}
        <Accordion defaultExpanded className="grow">
          <AccordionDetails>
            <RichTextArea name="options" data={answ.answer} />
          </AccordionDetails>
        </Accordion>
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
      {errors.root || error ? (
        <FormHelperText error>
          {errors?.root?.message || error?.message}
        </FormHelperText>
      ) : null}
    </FormGroup>
  );
};

export default RenderQuestionAnswers;
