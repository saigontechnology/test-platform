'use client';

import { IAssessment } from '@/app/constants/assessments';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ModifyAssessment from '../../(components)/modifyAssessment';

const EditPage = () => {
  const [data, setData] = useState<any>(null);
  const pathname = usePathname().split('/');

  useEffect(() => {
    getEditQuestion();
  }, []);

  const getEditQuestion = async () => {
    const { data } = await ApiHook<IAssessment>(
      Methods.GET,
      `/assessments/${pathname[pathname.length - 1]}`,
    );
    setData(data);
  };
  if (data) return <ModifyAssessment detail={data} />;
  return <Box />;
};

export default EditPage;
