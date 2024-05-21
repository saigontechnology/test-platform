/* eslint-disable react/jsx-no-undef */
'use client';

import useWindowSize from '@/hooks/common/useWindowSize';
import {
  useGetExamination,
  useSubmitExamination,
  useUpdateExaminationExpired,
} from '@/hooks/examination/hooks';
import { IExamAnswer } from '@/hooks/examination/types';
import { formatTimeString } from '@/libs/utils';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import { CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import ExaminationLayout from './(components)/examinationLayout';
import LinkExpired from './(components)/linkExpired';
import Loading from './(components)/loading';
import LogoBanner from './(components)/logoBanner';

type Layout = 'overview' | 'examination' | 'result';

interface ISubmitExaminationResult {
  correctQuestions: number;
  scored: number;
}

const getClientSideCookie = (name: string): string | undefined => {
  if (typeof document !== 'undefined') {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];

    return cookieValue;
  }
  return undefined;
};

export default function Examination() {
  const [layout, setLayout] = useState<Layout>('overview');
  const { width, height } = useWindowSize();
  const [examinationResult, setExaminationResult] =
    useState<ISubmitExaminationResult>();
  const [examId, setExamId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = getClientSideCookie('examId');
    setExamId(id);
  }, []);

  const {
    mutate: submitExaminationMutate,
    isPending: isSubmitExaminationPending,
  } = useSubmitExamination();

  const {
    mutate: updateExaminationExpiredMutate,
    isPending: isUpdateExaminationExpiredPending,
  } = useUpdateExaminationExpired();

  const examination = useGetExamination(examId?.toString()!);

  const isExpired = useMemo(
    () => new Date() > new Date(examination?.data?.expireUtil!),
    [examination],
  );

  const handleSubmitExamination = (finalAnswers: IExamAnswer[]) => {
    setLayout('result');
    submitExaminationMutate(
      {
        examId: examId!,
        email: examination?.data?.email!,
        assessmentId: examination?.data?.assessmentId!,
        selections: finalAnswers,
      },
      {
        onSuccess: (data) => {
          setLayout('result');
          setExaminationResult(data as unknown as ISubmitExaminationResult);
        },
      },
    );
  };

  const renderLayoutExamination = () => {
    switch (layout) {
      case 'overview':
        return !examination.isPending ? (
          isExpired ? (
            <LinkExpired />
          ) : (
            <div className="grid h-screen grid-cols-2 gap-2 p-20">
              <div className="mb-20 flex items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-[32px] font-bold">
                    {examination?.data?.assessment?.name}
                  </p>
                  {examination.isPending ? (
                    <>
                      <div className="flex animate-pulse gap-10">
                        <div className="flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                          <div className="h-4 w-20 rounded bg-gray-200"></div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                          <div className="h-4 w-20 rounded bg-gray-200"></div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                          <div className="h-4 w-20 rounded bg-gray-200"></div>
                        </div>
                      </div>
                      <div className="mt-10 h-12 w-40 rounded-xl bg-gray-200"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-10">
                        <div className="flex items-center gap-1">
                          <AccessAlarmIcon fontSize="small" />
                          <p className="mt-[2px] text-[14px] font-light">
                            {formatTimeString(
                              examination?.data?.durationTotal || 0,
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <ViewStreamOutlinedIcon fontSize="small" />
                          <p className="text-[14px] font-light">
                            {examination?.data?.questionNumbers}{' '}
                            {examination?.data?.questionNumbers === 1
                              ? 'question'
                              : 'questions'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <KeyboardDoubleArrowUpOutlinedIcon fontSize="small" />
                          <p className="text-[14px] font-light">
                            {examination?.data?.assessment?.level}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLayout('examination');
                          updateExaminationExpiredMutate({ examId: examId! });
                        }}
                        disabled={isUpdateExaminationExpiredPending}
                        className="item-center mt-10 flex h-12 w-40 justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                      >
                        <div className="flex h-full items-center">
                          {isUpdateExaminationExpiredPending ? (
                            <div className="flex items-center gap-2">
                              <CircularProgress
                                size={16}
                                className="text-white"
                              />
                              <span>Starting ...</span>
                            </div>
                          ) : (
                            <span>Start Test</span>
                          )}
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-20 flex items-center">
                <LogoBanner />
              </div>
            </div>
          )
        ) : (
          <div className="flex h-screen w-full items-center justify-center">
            <Loading />
          </div>
        );

      case 'examination':
        return (
          <ExaminationLayout
            assessmentId={examination?.data?.assessmentId.toString()!}
            onSubmitExam={(finalAnswers: IExamAnswer[]) =>
              handleSubmitExamination(finalAnswers)
            }
          />
        );

      case 'result':
        return (
          <div className="grid h-screen grid-cols-2 gap-2 p-20">
            <div className="mb-20 flex items-center">
              <div className="flex flex-col gap-4">
                <span className="text-[20px] font-light">Congratulations!</span>
                <p className="text-[26px] font-bold text-slate-600">
                  Your challenge has been completed successfully!
                </p>
                <div className="mt-10 h-[1px] w-full bg-slate-100" />
                <span className="text-[16px] font-semibold">Test Results</span>
                {isSubmitExaminationPending ? (
                  <div className="flex animate-pulse flex-col gap-1">
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px]">
                      - Correct questions:
                      {` ${examinationResult?.correctQuestions}/${examination.data?.questionNumbers}`}
                    </span>
                    <span className="text-[14px]">
                      - Score: {examinationResult?.scored}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-20 flex items-center">
              <LogoBanner />
            </div>
            <div className="flex h-full flex-col-reverse">
              <span className="text-[14px] font-light">
                *Note: You can close this page at this time.
              </span>
            </div>
            <Confetti width={width} height={height} recycle={false} />
          </div>
        );

      default:
        break;
    }
  };

  return renderLayoutExamination();
}
