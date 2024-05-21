'use client';

import { IAssessment, IExamination, IQuestion } from '@/constants/assessments';
import { getClientSideCookie, regexEmail } from '@/libs/utils';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CustomModal from '../../components/molecules/CustomModal';
import Header from '../../components/organisms/Header';
import ApiHook, { Methods } from '../../libs/apis/ApiHook';
import CountdownTimer, {
  CountdownTimerHandler,
} from './(components)/countdownTimer';
import { PaperContent } from './(components)/modalContents/paperContent';

interface IExamAnswerPayload {
  questionId: number;
  selections: number[];
}

interface IExamResult {
  email: string;
  scored: number;
}

const ModalExpiredContent = dynamic(
  () => import('./(components)/modalContents/modalExpired'),
);
const ModalTimeoutContent = dynamic(
  () => import('./(components)/modalContents/modalTimeout'),
);
const AssessmentQuestions = dynamic(
  () => import('./(components)/assessmentQuestion'),
  {
    ssr: false,
  },
);
const ExaminationFinalResult = dynamic(() => import('./(components)/result'), {
  ssr: false,
});

export default function ExaminationPage() {
  const router = useRouter();
  const [examInfo, setExamInfo] = useState<IExamination | null>(null);
  const [assessmentInfo, setAssessmentInfo] = useState<{
    data: IAssessment | null;
    error: Error | null;
    retryTimes?: number;
  } | null>(null);
  const [assessments, setAssessments] = useState<IQuestion[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [examScored, setExamScored] = useState<number>(0);
  const modalExaminationRef = useRef<any>(null);
  const [candidateEmail, setCandidateEmail] = useState<string | null>(null);
  const countdownTimerRef = useRef<CountdownTimerHandler>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
      // sessionStorage.setItem('finished', (+new Date()).toString(36));
      sessionStorage.setItem(
        'examination',
        JSON.stringify({
          timer: countdownTimerRef.current?.getTime() as any,
          currentQ: currentQuestionId,
        }),
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentQuestionId]);

  const Handlers = {
    updateAssessmentExpired: async (examId: number) => {
      await ApiHook(Methods.PUT, `/examinations/expired/${examId}`);
    },
    getExamInfo: async (examId: string) => {
      if (candidateEmail) {
        const resExam: { data: IExamination } = await ApiHook(
          Methods.GET,
          `/examinations/${examId}`,
        );
        return resExam.data.email === candidateEmail ? resExam.data : null;
      }
      return null;
    },
    getAssessment: async (examId: string, examData: IExamination) => {
      const resAssess: { data: IAssessment } = await ApiHook(
        Methods.GET,
        `/assessments/${examData?.assessmentId}`,
      );
      if (resAssess.data.assessmentQuestionMapping.length) {
        const cachedQuestion = JSON.parse(
          sessionStorage.getItem('examination')!,
        )?.currentQ;
        try {
          const currDate = new Date(),
            expireDate = new Date(examData.expireUtil);
          if (currDate <= expireDate) {
            setExamInfo(examData);
            setAssessmentInfo({ data: resAssess.data, error: null });
            setAssessments(resAssess.data.assessmentQuestionMapping);
            setCurrentQuestionId(
              cachedQuestion ||
                resAssess.data.assessmentQuestionMapping[0].question.id,
            );
            Handlers.updateAssessmentExpired(parseInt(examId));
          } else {
            setIsExpired(true);
            modalExaminationRef.current?.open();
          }
        } finally {
          /** Clear cookie of 'examId' */
          // document.cookie =
          //   'examId' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          countdownTimerRef.current?.setTime(1800);
        }
      } else {
        // TODO:
      }
    },
    fetchExamination: async () => {
      const examId = getClientSideCookie('examId');
      if (!examId) {
        setIsExpired(true);
        return;
      }
      const examInformation = await Handlers.getExamInfo(examId).then(
        (result) => result,
      );
      if (candidateEmail === examInformation?.email) {
        Handlers.getAssessment(examId, examInformation);
      } else {
        let _retryTimes = assessmentInfo?.retryTimes || 3;
        _retryTimes < 1
          ? router.replace('/')
          : setAssessmentInfo({
              data: null,
              retryTimes: _retryTimes,
              error: new Error(
                `Invalid candidate email, you have ${_retryTimes--} times to retry. ${
                  _retryTimes < 2
                    ? 'The last time it failed, it will automatically reroute and end the examination.'
                    : null
                }`,
              ),
            });
      }
    },
    handleSubmit: async (finalAnswers: IExamAnswerPayload[]) => {
      setIsSubmit(true);
      const payload = {
        email: examInfo?.email,
        assessmentId: assessmentInfo?.data?.id,
        selections: finalAnswers,
      };
      const result: { data: IExamResult; error: any } = await ApiHook(
        Methods.PUT,
        `/examinations/${examInfo?.id}`,
        {
          data: payload,
        },
      );
      if (result.error) {
        alert('Examination submit got error');
      } else {
        sessionStorage.removeItem('examination');
        setExamScored(result.data.scored);
      }
    },
    handleNext: ({
      currId,
      answers: currentAnswers,
    }: {
      currId: number;
      answers: number[];
    }) => {
      const currIndex = assessments.findIndex(
        (ass) => ass.question.id === currId,
      );
      if (currIndex > -1) {
        const newAnswers = { ...answers, [currId]: currentAnswers };
        setAnswers(newAnswers);
        const nextCond = assessments?.[currIndex + 1]?.question?.id;
        if (nextCond) {
          setCurrentQuestionId(nextCond);
        } else {
          //submit
          const _answers = Object.entries(newAnswers).map(([key, value]) => {
            return {
              questionId: parseInt(key),
              selections: value,
            };
          });
          Handlers.handleSubmit(_answers as IExamAnswerPayload[]);
        }
      }
    },
    handleExamTimeOut: () => {
      // Todo: Show dialog notice timeout.
      modalExaminationRef.current?.open();
    },
  };

  return (
    <Box className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <Box className="flex-grow bg-[#f9f9f9]">
        {!isSubmit && (
          <Header>
            <Stack
              className="justify-center"
              direction="row"
              spacing={4}
              height={50}
              width={500}
            >
              <Box width={50} bgcolor={'#c5c5c5'} />
              <Stack>
                <span>
                  <b>Examination:</b>
                </span>
                <span>{examInfo?.assessment.name}</span>
              </Stack>
            </Stack>
            <CountdownTimer
              ref={countdownTimerRef}
              isPause={!assessmentInfo}
              handleTimeout={Handlers.handleExamTimeOut}
            />
            <Stack
              className="items-center justify-center"
              direction="row"
              spacing={4}
              height={50}
              width={500}
            >
              <Box>{examInfo?.email}</Box>
            </Stack>
          </Header>
        )}
        <Box className="m-6 flex-grow rounded-[15px] p-6 md:overflow-y-auto">
          {!examInfo ? (
            <PaperContent
              setStateEmail={setCandidateEmail}
              isDisabled={!regexEmail(candidateEmail)}
              onChanged={Boolean(candidateEmail?.length)}
              gotoExam={() => {
                Handlers.fetchExamination();
              }}
              error={assessmentInfo?.error?.message}
            />
          ) : (
            <>
              {!isSubmit &&
                assessments?.map((ass, index) => (
                  <AssessmentQuestions
                    key={ass.question.id}
                    order={index + 1}
                    isLast={assessments.length - 1 === index}
                    assessment={ass}
                    active={currentQuestionId === ass.question.id}
                    onNext={Handlers.handleNext}
                  />
                ))}
              {isSubmit && (
                <ExaminationFinalResult
                  isDisabledExit={false}
                  examResult={{
                    information: assessmentInfo,
                    scored: examScored,
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Box>
      <CustomModal ref={modalExaminationRef}>
        {isExpired ? <ModalExpiredContent /> : <ModalTimeoutContent />}
      </CustomModal>
    </Box>
  );
}
