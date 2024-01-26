'use client';

import React, { useEffect, useState } from 'react';
import CreateQuestion, { IQuestionInfo } from '../../create/page';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { usePathname } from 'next/navigation';
import { IResponseQuestion } from '@/app/lib/apis/Interfaces';
import { Box } from '@mui/material';

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
        title: data?.question,
        content: data?.description,
        categories: new Array().concat(data?.category),
        answers: data?.answer,
        options: data?.options,
        type: data?.type,
      };
      setData(editQuestion);
    })();
  }, []);

  return <Box>{data ? <CreateQuestion questionData={data} /> : null}</Box>;
};

export default EditQuestion;
