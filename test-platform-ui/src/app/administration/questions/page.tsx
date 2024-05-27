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
import TFGrid from './grid-components';
import { ICardData } from './grid-components/listItem';

export interface IQuestion {
  id: number;
  title: string;
  content: string;
  categories: string[];
  answers: number[];
  options: string[];
  level: string;
  type: string;
  duration: number;
  category: string;
  question: string;
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
  const router = useRouter();
  const { data, updateData } = useContext(DataContext);

  const [_questionList, setQuestionList] = useState<ICardData[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [isImportLoading, setImportLoading] = useState<boolean>(false);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const getGridQuestion = async () => {
    setLoading(true);
    const _questions = await ApiHook(Methods.GET, '/admin/questions');
    const _questionList: ICardData[] = (
      _questions.data as Array<IResponseQuestion>
    ).map((q: IResponseQuestion) => {
      const questionCard = {
        id: q.id,
        title: q.question,
        tags: [
          'Aggregation',
          'Data Filtering',
          'Data Manipulation',
          'Database Management',
        ],
        flagChip: {
          label: q.category,
        },
        description: {
          content: q.description,
        },
        cardInfo: {
          info: ['Multiple Choice', 'Easy', '30 min'],
        },
      };
      return questionCard;
      // return {
      //   id: q.id,
      //   title: q.question,
      //   content: q.description,
      //   categories: new Array().concat(q.category),
      //   answers: q.answer,
      //   options: q.options,
      //   type: q.type,
      //   level: q.level,
      // };
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
      const { error } = await ApiHook(Methods.POST, `/admin/questions/import`, {
        data: importQuestions,
      });
      !error && showNotification('Import questions successfully', 'success');
      setImportLoading(false);
      getGridQuestion();
    };
  };

  const pageChange = (currentPage: number) => {
    setCurrentPageNum(currentPage);
  };

  return (
    <Box>
      <Box className="flex h-fit flex-row-reverse items-center justify-between gap-4 pb-4">
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
        <TFGrid
          data={_questionList}
          paging={3}
          handlePageChange={pageChange}
          currPage={currentPageNum}
        />
        <Box className="summary-list h-[inherit] border-2 border-dashed border-slate-300"></Box>
      </Stack>
    </Box>
  );
};
export default Page;
