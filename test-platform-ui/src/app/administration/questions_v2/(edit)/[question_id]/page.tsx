'use client';

import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { IResponseQuestion } from '@/constants/questions';
import { Box } from '@mui/material';
import ModifyQuestion, {
  IQuestionInfo,
} from '../../(components)/modifyQuestion';

const EditQuestion = () => {
  const [data, setData] = useState<IQuestionInfo | null>(null);
  const pathname = usePathname().split('/');

  useEffect(() => {
    (async () => {
      const { data } = await ApiHook<IResponseQuestion>(
        Methods.GET,
        `/questions/${pathname[pathname.length - 1]}`,
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
        time: data?.time,
      };
      setData(editQuestion);
    })();
  }, []);

  return (
    <Suspense fallback={<p>Loading ....</p>}>
      <Box>{data ? <ModifyQuestion questionData={data} /> : null}</Box>
    </Suspense>
  );
};

export default EditQuestion;
