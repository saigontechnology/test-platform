'use client';

import { Button, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CustomModal from '../../components/molecules/CustomModal';
import Header from '../../components/organisms/Header';
import {
  IAssessment,
  IExamination,
  IQuestion,
} from '../../constants/assessments';
import ApiHook, { Methods } from '../../libs/apis/ApiHook';
import { getClientSideCookie } from '../../libs/utils';
import AssessmentQuestion from './(components)/assessmentQuestion';
import CountdownTimer, {
  CountdownTimerHandler,
} from './(components)/countdownTimer';
import ExaminationResult from './(components)/result';

interface IExamAnswerPayload {
  questionId: number;
  selections: number[];
}

interface IExamResult {
  email: string;
  scored: number;
}

/** Modal content to warning examination timeout */
const ModalContent: React.FC = () => {
  const router = useRouter();
  return (
    <Box className="grid p-4">
      <Typography className="whitespace-pre-line pb-6">
        {`Your examination is timeout. Result will be send via email ${sessionStorage.candidateEmail}. \n  Thanks you time to join examination.`}
      </Typography>
      <Button
        className="mx-auto text-lg"
        variant="contained"
        onClick={() => router.replace('/')}
      >
        Exit examination
      </Button>
    </Box>
  );
};

/** Modal content to warning examination expired */
const ModalExpired: React.FC = () => {
  const router = useRouter();
  return (
    <Box className="grid p-4">
      <Typography className="whitespace-pre-line pb-6">
        {`Your examination link is expired. Thanks for you time, please contact with our HR department for more details {HRDepartment}.`}
      </Typography>
      <Button
        className="mx-auto text-lg"
        variant="contained"
        onClick={() => router.replace('/')}
      >
        Close Examination
      </Button>
    </Box>
  );
};

export default function ExaminationPage() {
  const [examInfo, setExamInfo] = useState<IExamination>();
  const [assessmentInfo, setAssessmentInfo] = useState<IAssessment>();
  const [assessments, setAssessments] = useState<IQuestion[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [examScored, setExamScored] = useState<number>(0);
  const modalExaminationRef = useRef<any>(null);
  const countdownTimerRef = useRef<CountdownTimerHandler>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const examId = getClientSideCookie('examId') || 113;
    (async () => {
      const resExam: { data: IExamination } = await ApiHook(
          Methods.GET,
          `/examinations/${examId}`,
        ),
        resAssess: { data: IAssessment } = await ApiHook(
          Methods.GET,
          `/assessments/${resExam.data.assessmentId}`,
        );
      if (resAssess.data.assessmentQuestionMapping.length) {
        const cachedQuestion = JSON.parse(
          sessionStorage.getItem('examination')!,
        )?.currentQ;
        try {
          const currDate = new Date();
          if (currDate > resExam.data.expireUtil) {
            setExamInfo(resExam.data);
            setAssessmentInfo(resAssess.data);
            setAssessments(resAssess.data.assessmentQuestionMapping);
            setCurrentQuestionId(
              cachedQuestion ||
                resAssess.data.assessmentQuestionMapping[0].question.id,
            );
          } else {
            setIsExpired(true);
            modalExaminationRef.current?.open();
          }
        } finally {
          /** Clear cookie of 'examId' */
          // document.cookie =
          //   'examId' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          countdownTimerRef.current?.setTime(1200);
        }
      } else {
        // TODO:
      }
    })();
  }, []);

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
    handleSubmit: async (finalAnswers: IExamAnswerPayload[]) => {
      setIsSubmit(true);
      const payload = {
        email: examInfo?.email,
        assessmentId: assessmentInfo?.id,
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
            <Stack className="justify-center" direction="row" spacing={4} height={50} width={500}>
              <Box width={50} bgcolor={'#c5c5c5'} />
              <Stack>
                <span><b>Examination:</b></span>
                <span>{examInfo?.assessment.name}</span>
              </Stack>
            </Stack>
            <CountdownTimer
              ref={countdownTimerRef}
              isPause={!assessmentInfo}
              handleTimeout={Handlers.handleExamTimeOut}
            />
            <Stack className="items-center justify-center" direction="row" spacing={4} height={50} width={500}>
              <Box>{examInfo?.email}</Box>
            </Stack>
          </Header>
        )}
        <Box className="m-6 flex-grow rounded-[15px] p-6 md:overflow-y-auto">
          {!isSubmit &&
            assessments?.map((ass, index) => (
              <AssessmentQuestion
                key={ass.question.id}
                order={index + 1}
                isLast={assessments.length - 1 === index}
                assessment={ass}
                active={currentQuestionId === ass.question.id}
                onNext={Handlers.handleNext}
              />
            ))}
          {isSubmit && (
            <ExaminationResult
              isDisabledExit={false}
              examResult={{
                information: assessmentInfo,
                scored: examScored,
              }}
            />
          )}
        </Box>
      </Box>
      <CustomModal ref={modalExaminationRef}>
        {isExpired ? <ModalExpired /> : <ModalContent />}
      </CustomModal>
    </Box>
  );
}
