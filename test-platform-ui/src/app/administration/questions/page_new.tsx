'use client';

import { IResponseQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { DataContext } from '@/libs/contextStore';
import { showNotification } from '@/libs/toast';
import { handleMappingImportData } from '@/libs/utils';
import { AddBox } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import ListCardItem from './grid-components/listItem';

export interface IQuestion {
  id: number;
  title: string;
  content: string;
  categories: string[];
  answers: number[];
  options: string[];
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Page = () => {
  const [_questionList, setQuestionList] = useState<IQuestion[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [isImportLoading, setImportLoading] = useState<boolean>(false);

  const { data, updateData } = useContext(DataContext);

  const getGridQuestion = async () => {
    setLoading(true);
    const _questions = await ApiHook(Methods.GET, '/questions');
    const _questionList: IQuestion[] = (
      _questions.data as Array<IResponseQuestion>
    ).map((q: IResponseQuestion) => {
      return {
        id: q.id,
        title: q.question,
        content: q.description,
        categories: new Array().concat(q.category),
        answers: q.answer,
        options: q.options,
        type: q.type,
        level: q.level,
      };
    });
    setQuestionList(_questionList);
    setLoading(false);
  };

  useEffect(() => {
    getGridQuestion();
  }, []);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = async (e: any) => {
      let importQuestions = JSON.parse(e.target.result);
      const mappedQuestions = await handleMappingImportData(
        'X',
        importQuestions,
        'React',
      ).then((result) => result);
      importQuestions = JSON.stringify(mappedQuestions);
      setImportLoading(true);
      const { error } = await ApiHook(Methods.POST, `/questions/import`, {
        data: importQuestions,
      });
      !error && showNotification('Import questions successfully', 'success');
      setImportLoading(false);
      getGridQuestion();
    };
  };

  return (
    <Box>
      <Box className="flex flex-row-reverse items-center justify-between pb-10">
        <Box>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            className="mr-3"
            disabled={isImportLoading}
          >
            Import
            <VisuallyHiddenInput
              type="file"
              accept="application/JSON"
              onChange={handleImport}
            />
          </Button>
          <Button
            variant="contained"
            onClick={(evt: React.MouseEvent) => {
              evt.preventDefault();
              updateData({
                ...data,
                pagination: {
                  pageNum: 1,
                },
              });
              router.push(ROUTE_KEY.ADMINISTRATION_QUESTIONS_CREATE);
            }}
            startIcon={<AddBox />}
          >
            New Question
          </Button>
        </Box>
      </Box>
      <Stack
        className="h-[calc(100vh_-_220px)]"
        gridTemplateColumns={'2fr 1fr'}
        display={'grid'}
        gap={4}
      >
        <Box className="question-list h-full border-2 border-dashed border-slate-300">
          <ListCardItem />
          <ListCardItem />
          <ListCardItem />
        </Box>
        <Box className="summary-list h-full border-2 border-dashed border-slate-300"></Box>
      </Stack>
    </Box>
  );
};

export default Page;
