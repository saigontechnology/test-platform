'use client';

import { IResponseQuestion } from '@/app/constants/questions';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateQuestion from '../../create/page';

const EditQuestion = () => {
  const [data, setData] = useState<any>(null);
  const pathname = usePathname().split('/');

  useEffect(() => {
    getEditQuestion();
  }, []);

  const getEditQuestion = async () => {
    const { data } = await ApiHook<IResponseQuestion>(
      Methods.GET,
      `/questions/${pathname[pathname.length - 1]}`,
    );
    const editQuestion = {
      id: data?.id,
      title: data?.question,
      content: data?.description,
      categories: new Array().concat(data?.category),
      answers: data?.answer,
      options: data?.options,
      type: data?.type,
    };
    setData(editQuestion);
  };

  return <Box>{data ? <CreateQuestion questionData={data} /> : null}</Box>;
};

export default EditQuestion;
