/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
'use client';

import RichTextArea from '@/components/atoms/Editor/richtext';
import { IQuestion } from '@/constants/assessments';
import { useGetAssessmentById } from '@/hooks/assessment/hooks';
import { IExamAnswer } from '@/hooks/examination/types';
import { QuestionType } from '@/libs/definitions';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import 'react-quill/dist/quill.snow.css';
import Countdown from './countdown';
import { SkeletonAnswers, SkeletonQuestion } from './skeleton';

interface IExaminationLayoutProps {
  assessmentId: string;
  onSubmitExam: (finalAnswers: IExamAnswer[]) => void;
}

const ExaminationLayout: React.FC<IExaminationLayoutProps> = ({
  assessmentId,
  onSubmitExam,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [finalAnswers, setFinalAnswers] = useState<IExamAnswer[]>([]);
  const [selectedAnswerValues, setSelectedAnswerValues] = useState<number[]>(
    [],
  );

  console.log('currentQuestionIndex', currentQuestionIndex);

  const dialogRef = useRef<any>(null);
  const dialogLeaveRef = useRef<any>(null);
  const countdownRef = useRef<{ stop: () => void }>(null);

  const assessment = useGetAssessmentById(assessmentId);

  const handleAddFinalAnswer = (questionId: number, selections: number[]) => {
    setFinalAnswers([...finalAnswers, { questionId, selections }]);
  };

  const handleChangeAnswerWithCheckbox = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value, 10);
    setSelectedAnswerValues((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((val) => val !== value);
      } else {
        return [...prevValues, value];
      }
    });
  };

  useEffect(() => {
    setCurrentQuestion(
      assessment?.data?.assessmentQuestionMapping[currentQuestionIndex],
    );
  }, [assessment]);

  const isLastQuestion = useMemo(
    () =>
      currentQuestion?.question?.id ===
      assessment?.data?.assessmentQuestionMapping?.[
        assessment?.data?.assessmentQuestionMapping?.length - 1
      ].question?.id,
    [currentQuestion, assessment],
  );

  const isExistLastQuestionInFinalAnswer: IExamAnswer | undefined = useMemo(
    () =>
      finalAnswers?.find(
        (item) =>
          item.questionId ===
          assessment?.data?.assessmentQuestionMapping?.[
            assessment?.data?.assessmentQuestionMapping?.length - 1
          ].question?.id,
      ),
    [selectedAnswerValues, assessment],
  );

  const handleNextQuestion = useCallback(() => {
    if (!isExistLastQuestionInFinalAnswer) {
      handleAddFinalAnswer(
        currentQuestion?.question?.id!,
        selectedAnswerValues,
      );
    }

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }

    if (isLastQuestion) {
      onSubmitExam([
        ...finalAnswers,
        {
          questionId: currentQuestion?.question?.id!,
          selections: selectedAnswerValues,
        },
      ]);
      countdownRef?.current?.stop();
      return;
    }

    setSelectedAnswerValues([]);
  }, [
    currentQuestion,
    assessment,
    isExistLastQuestionInFinalAnswer,
    onSubmitExam,
  ]);

  const handleManualNextQuestion = () => {
    if (selectedAnswerValues.length === 0) {
      dialogRef.current.openDialog();
      return;
    }
    handleNextQuestion();
  };

  const renderOptions = () => {
    const questionType = currentQuestion?.question?.type;

    switch (questionType) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <RadioGroup
            value={selectedAnswerValues}
            onChange={(e) => setSelectedAnswerValues([Number(e.target.value)])}
          >
            {currentQuestion?.question?.options?.map((item, index) => {
              const handleOptionClick = () => {
                setSelectedAnswerValues([index]); // Set the selected item when the div is clicked
              };

              return (
                <div
                  key={index}
                  className="mt-5 cursor-pointer"
                  onClick={handleOptionClick}
                >
                  <div className="flex items-center rounded-md border-[1px] border-[#99a2ae] p-5">
                    <FormControlLabel
                      value={index}
                      control={<Radio />}
                      label=""
                    />
                    <RichTextArea
                      key={`${index}`}
                      name="answer"
                      data={item}
                      isReadOnly={true}
                    />
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <FormGroup onChange={handleChangeAnswerWithCheckbox}>
            {currentQuestion?.question?.options?.map((item, index) => {
              const handleOptionClick = () => {
                // Toggle checkbox selection for the corresponding index
                const isChecked = !selectedAnswerValues.includes(index);
                const updatedSelectedValues = isChecked
                  ? [...selectedAnswerValues, index]
                  : selectedAnswerValues.filter((value) => value !== index);
                setSelectedAnswerValues(updatedSelectedValues);
              };

              return (
                <div
                  key={index}
                  className="mt-5 cursor-pointer"
                  onClick={handleOptionClick}
                >
                  <div className="flex items-center rounded-md border-[1px] border-[#64748b] p-5">
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={index}
                          checked={selectedAnswerValues.includes(index)}
                        />
                      }
                      label=""
                    />
                    <RichTextArea
                      key={`${index}`}
                      name="answer"
                      data={item}
                      isReadOnly={true}
                    />
                  </div>
                </div>
              );
            })}
          </FormGroup>
        );

      default:
        break;
    }
  };

  return (
    <div className="flex">
      <div className="sticky top-0 flex h-screen w-48 flex-col justify-between">
        <div className="flex items-center justify-center bg-slate-900 p-4 [&_span]:text-2xl [&_span]:font-bold">
          {!assessment?.isLoading && !currentQuestion?.question.duration ? (
            <CircularProgress
              color="inherit"
              size={32}
              className="text-white"
            />
          ) : currentQuestion?.question.duration ? (
            <Countdown
              ref={countdownRef}
              key={currentQuestionIndex}
              value={currentQuestion?.question?.duration!}
              onFinish={() => {
                dialogRef?.current?.closeDialog();
                handleNextQuestion();
              }}
            />
          ) : (
            <span className=" text-white">Time up</span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[16px] font-semibold">{`${Number(assessment?.data?.assessmentQuestionMapping.findIndex((item) => item.question.id === currentQuestion?.question.id)) + 1}/${assessment?.data?.assessmentQuestionMapping.length}`}</span>
          <span className="top-20 text-[13px] text-slate-400">
            Question Index
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <button
              onClick={() => dialogLeaveRef?.current?.openDialog()}
              className="mb-2 me-2 rounded-lg border-[1px] border-[#6c6e69] px-5 py-2.5 text-center text-[15px] font-medium text-[#6c6e69]"
            >
              <div className="flex items-center justify-center gap-2">
                <LogoutOutlinedIcon fontSize="small" />
                <span className="text-[16px]">Leave</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="bg flex w-32 flex-1 flex-col justify-between  border-l-[1px] border-[#64748b]">
        <div>
          <div className="flex h-14 items-center justify-between border-b-[1px] border-[#64748b] px-5">
            {assessment?.isLoading ? (
              <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            ) : (
              <span className="font-bold">
                {currentQuestion?.question?.question}
              </span>
            )}
            <button
              onClick={() => handleManualNextQuestion()}
              className="inline-flex items-center rounded-lg bg-[#7bbd1e] px-5 py-2.5 text-center text-[15px] font-medium text-white hover:bg-[#7bbd1e] focus:bg-[#7bbd1e] dark:bg-[#7bbd1e] dark:hover:bg-[#7bbd1e] dark:focus:bg-[#7bbd1e]"
            >
              {isLastQuestion ? 'Submit' : 'Next'}
              <svg
                className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 60px)' }}
          >
            <div className="px-5 py-5">
              {assessment.isLoading ? (
                <SkeletonQuestion />
              ) : (
                <RichTextArea
                  key="questionDescriptionPreview"
                  name="description"
                  data={currentQuestion?.question?.description!}
                  isReadOnly={true}
                />
              )}
            </div>
            <div className="flex flex-col gap-3 px-5">
              <div className="mt-6 flex items-center gap-2">
                <span className="w-[140px] text-[15px] font-semibold">
                  Answer Options
                </span>
                <div className="h-[1px] w-full border-t-[1px] border-[#64748b]"></div>
              </div>
              <div>
                <span className="w-[140px] text-[14px]">
                  Select any one option
                </span>
                {assessment.isLoading ? <SkeletonAnswers /> : renderOptions()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row-reverse p-4">
          <span className="text-[14px]">
            {`*Warning: Don't close this page when not completed, because you cannot retake this test.`}
          </span>
        </div>
      </div>
      <SimpleDialog
        ref={dialogRef}
        children={
          <div className="flex w-[500px] items-center justify-center">
            <div className="p-4 text-center md:p-5">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="text-md mb-5 font-normal text-gray-500 dark:text-gray-400">
                You skipped the question without selecting any answer. Are you
                sure?
              </h3>
              <div className="mt-10">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                  onClick={() => {
                    dialogRef.current.closeDialog();
                    handleNextQuestion();
                  }}
                >
                  {`Yes, I'm sure`}
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  onClick={() => dialogRef.current.closeDialog()}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        }
      />

      <SimpleDialog
        ref={dialogLeaveRef}
        children={
          <div className="flex w-[500px] items-center justify-center">
            <div className="p-4 text-center md:p-5">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="text-md mb-5 font-normal text-gray-500 dark:text-gray-400">
                If you agree to leave the examination, we will record the
                results of the questions you have completed. And you cannot
                retake this test. Are you sure?
              </h3>
              <div className="mt-10">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                  onClick={() => {
                    dialogLeaveRef.current.closeDialog();
                    onSubmitExam(finalAnswers);
                  }}
                >
                  {`Yes, I'm sure`}
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  onClick={() => dialogLeaveRef.current.closeDialog()}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ExaminationLayout;

interface SimpleDialogProps {
  children: React.ReactNode;
}

const SimpleDialog = forwardRef<any, SimpleDialogProps>((props, ref) => {
  const { children } = props;
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    openDialog: () => setInternalOpen(true),
    closeDialog: () => setInternalOpen(false),
  }));

  return (
    <Dialog
      open={internalOpen}
      onClose={() => setInternalOpen(false)}
      sx={{
        backdropFilter: 'blur(5px) sepia(5%)',
        // 👇 Another option to style Paper
        '& .MuiDialog-paper': {
          borderRadius: '18px',
        },
      }}
    >
      {children}
    </Dialog>
  );
});
