'use client';

import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { Suspense, useEffect, useState } from 'react';

import { IResponseQuestion } from '@/constants/questions';
import { Box } from '@mui/material';
import { IQuestionInfo } from '../../(components)/models';
import ModifyQuestion from '../../(components)/modifyQuestion';

const EditQuestion = ({
  questionId,
  onClose,
}: {
  questionId: number;
  onClose: () => void;
}) => {
  const [data, setData] = useState<IQuestionInfo | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await ApiHook<IResponseQuestion>(
        Methods.GET,
        `/admin/questions/${questionId}`,
      );
      const editQuestion: IQuestionInfo = {
        id: data?.id,
        question: data?.question,
        description: data?.description,
        categories: new Array().concat(data?.categories),
        category: data?.category,
        notes: data?.notes,
        answers: data?.answer,
        options: data?.options,
        type: data?.type,
        level: data?.level,
        isModified: data?.isModified,
        duration: data?.duration,
      };
      setData(editQuestion);
    })();
  }, []);

  return (
    <Suspense fallback={<p>Loading ....</p>}>
      <Box>
        {data ? <ModifyQuestion questionData={data} onClose={onClose} /> : null}
      </Box>
    </Suspense>
  );
};

export default EditQuestion;
