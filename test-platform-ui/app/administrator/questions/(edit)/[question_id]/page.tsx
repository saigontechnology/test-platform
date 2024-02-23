'use client';

import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { IResponseQuestion } from '@/app/constants/questions';
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
        categories: new Array().concat(data?.category),
        answers: data?.answer,
        options: data?.options,
        type: data?.type,
      };
      setData(editQuestion);
    })();
  }, []);

  return <Box>{data ? <ModifyQuestion questionData={data} /> : null}</Box>;
};

export default EditQuestion;
