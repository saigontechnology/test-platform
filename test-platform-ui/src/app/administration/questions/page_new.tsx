'use client';

import { IResponseQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { DataContext } from '@/libs/contextStore';
import { showNotification } from '@/libs/toast';
import { handleMappingImportData } from '@/libs/utils';
import { AddBox } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
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
      <Stack
        className="h-[calc(100vh_-_120px)]"
        gridTemplateColumns={'2fr 1fr'}
        display={'grid'}
        gap={4}
      >
        <Box className="question-list grid h-full gap-3">
          {[1, 2, 3].map((value: number, _indx: number) => (
            <ListCardItem
              cardData={{
                title: `Render card data title ${value}`,
                tags: [
                  'Aggregation',
                  'Data Filtering',
                  'Data Manipulation',
                  'Database Management',
                ],
                flagChip: {
                  label: 'Javascript',
                },
                description: {
                  label: 'Testing description label',
                  content: `Testing description content. Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard
                  dummy text ever since the 1500s`,
                  // render: () => (
                  //   <>
                  //     <div>{`Question Gist data ${_indx}`}</div>
                  //     <div>
                  //       Lorem Ipsum is simply dummy text of the printing and
                  //       typesetting industry. Lorem Ipsum has been the standard
                  //       dummy text ever since the 1500s,
                  //     </div>
                  //   </>
                  // )
                },
                cardInfo: {
                  render: () => {
                    return (
                      <>
                        <span className="info-chip">
                          <TaskAltIcon fontSize="small" />
                          Multiple Choice
                        </span>
                        <span className="info-chip">
                          <StackedBarChartOutlinedIcon
                            sx={{
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          Easy
                        </span>
                        <span className="info-chip">
                          <AccessTimeIcon
                            sx={{
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          30 min
                        </span>
                      </>
                    );
                  },
                },
              }}
            />
          ))}
        </Box>
        <Box className="summary-list h-full border-2 border-dashed border-slate-300">
          <Box className="flex flex-row-reverse items-center justify-between pb-6">
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
        </Box>
      </Stack>
    </Box>
  );
};

export default Page;
