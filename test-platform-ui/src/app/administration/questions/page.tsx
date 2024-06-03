'use client';

import { IResponseQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { DataContext } from '@/libs/contextStore';
import { showNotification } from '@/libs/toast';
import {
  containsSubstring,
  formatTimeString,
  handleMappingImportData,
} from '@/libs/utils';
import { AddBox } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  getQuestionLevel,
  getQuestionType,
} from './(components)/(question-form)/preview';
import GridSettings, { GriSettingHandler } from './(components)/preview';
import { IOption } from './(components)/preview/accordion/accordion';
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
  const cachedQuestions = useRef<IResponseQuestion[]>([]);
  const tempQuestionOnSearch = useRef<ICardData[] | null>(null);
  const previewRef = useRef<GriSettingHandler | null>(null);

  const getGridQuestion = async () => {
    setLoading(true);
    const { data } = await ApiHook(Methods.GET, '/admin/questions');
    cachedQuestions.current = data as Array<IResponseQuestion>;
    const _questionList: ICardData[] = (data as Array<IResponseQuestion>).map(
      (q: IResponseQuestion) => {
        const questionCard = {
          id: q.id,
          title: q.question,
          flagChip: {
            label: q.category,
          },
          description: {
            content: q.description,
          },
          cardInfo: {
            info: [
              getQuestionType(q.type),
              getQuestionLevel(q.level),
              formatTimeString(q.duration),
            ],
            render: () => {
              return (
                <>
                  <span className="info-chip">
                    <TaskAltIcon fontSize="small" />
                    {getQuestionType(q.type)}
                  </span>
                  <span className="info-chip">
                    <StackedBarChartIcon
                      sx={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    {getQuestionLevel(q.level)}
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
        };
        return questionCard;
      },
    );
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

  const handleSearch = (searchVal: string) => {
    /** Search based on fields:
     *    - title
     *    - description
     *    - tags (optional could be remove)
     */
    if (tempQuestionOnSearch.current) {
      if (/#/.test(searchVal) && searchVal.replace(/#/, '')?.length) {
        const searchId: string = searchVal.replace(/#/, '');
        const searchResult = tempQuestionOnSearch.current.find(
          (_d: ICardData) => _d.id === Number(searchId),
        );
        return searchResult ? new Array(searchResult) : [];
      } else {
        return tempQuestionOnSearch.current.filter((_d: ICardData) => {
          // Search on title:
          if (containsSubstring(_d.title, searchVal)) {
            return _d;
          }
          // Search on description:
          if (containsSubstring(_d.description.content, searchVal)) {
            return _d;
          }
          // Search on tags:
          const existTag = _d.tags?.find((tag) => {
            if (containsSubstring(tag, searchVal)) {
              return tag;
            }
          });
          if (existTag) {
            return _d;
          }
        });
      }
    } else return null;
  };

  const renderItemActions = (itemId: number) => {
    return (
      <>
        <IconButton
          sx={{
            alignSelf: 'center',
          }}
          onClick={() => {
            const previewItem = cachedQuestions.current.find(
              (_q: IResponseQuestion) => _q.id === itemId,
            );
            previewItem && previewRef.current?.onPreview(previewItem);
          }}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          sx={{
            alignSelf: 'center',
          }}
          onClick={() =>
            router.push(`${ROUTE_KEY.ADMINISTRATION_QUESTIONS}/${itemId}`)
          }
        >
          <ModeEditIcon />
        </IconButton>
      </>
    );
  };

  const handleOnSearch = (searchVal: string) => {
    /**  Notes:
     *    - Validate <!Null> to avoid to set tempQuestionOnSearch every time onchange.
     */
    if (!tempQuestionOnSearch.current) {
      tempQuestionOnSearch.current = _questionList;
    }
    const filteredItems = handleSearch(searchVal);
    if (filteredItems) {
      setCurrentPageNum(1);
      setQuestionList(filteredItems);
    }
  };

  return (
    <Stack
      className="h-[inherit]"
      gridTemplateColumns={'fit-content(60%) 1fr'}
      display={'grid'}
      gap={4}
    >
      <TFGrid
        data={_questionList}
        defaultPageSize={10}
        handlePageChange={pageChange}
        currPage={currentPageNum}
        placeholder="Search question ..."
        itemActions={renderItemActions}
        handleOnSearch={handleOnSearch}
        handleSearchClear={() => {
          tempQuestionOnSearch.current = null;
          getGridQuestion();
        }}
      />
      <Stack className="h-[inherit]">
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
        <GridSettings
          ref={previewRef}
          onFilter={(checked: IOption[]) => {
            console.log('handle filter: ', checked);
          }}
        />
      </Stack>
    </Stack>
  );
};
export default Page;
