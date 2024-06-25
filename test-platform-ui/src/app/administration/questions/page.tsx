'use client';

import TFButton from '@/components/atoms/TFButton';
import TFDrawer, { TFDrawerHandler } from '@/components/molecules/CustomDrawer';
import { IResponseQuestion } from '@/constants/questions';
import { TFPermissions } from '@/constants/role-by-permissions';
import useDebounce from '@/hooks/common/useDebounce';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { AuthContext, DataContext } from '@/libs/contextStore';
import { showNotification } from '@/libs/toast';
import { formatTimeString, handleMappingImportData } from '@/libs/utils';
import { AddBox } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getQuestionLevel,
  getQuestionType,
} from './(components)/(question-form)/preview';
import CreateQuestion from './(components)/create';
import EditQuestion from './(components)/edit';
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
  const { data, updateData, isNavCollapsed } = useContext(DataContext);
  const { authData } = useContext(AuthContext);

  const [_questionList, setQuestionList] = useState<ICardData[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [isImportLoading, setImportLoading] = useState<boolean>(false);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [listInfo, setListInfo] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const cachedQuestions = useRef<IResponseQuestion[]>([]);
  const tempQuestionOnSearch = useRef<ICardData[] | null>(null);
  const [modifyInfo, setModifyInfo] = useState<{
    title: string;
    editId?: number;
  } | null>(null);

  const previewRef = useRef<GriSettingHandler | null>(null);
  const drawerRef = useRef<TFDrawerHandler | null>(null);

  const getGridQuestion = async (searchVal?: string) => {
    setLoading(true);
    const response: any = await ApiHook(Methods.GET, `/admin/questions`, {
      params: {
        page: currentPageNum,
        limit: pageSize,
        ...filters,
        search: searchVal || undefined,
      },
    });
    const { data: questions, ...rest } = response.data;
    cachedQuestions.current = questions as Array<IResponseQuestion>;
    const _questionList: ICardData[] = (
      questions as Array<IResponseQuestion>
    ).map((q: IResponseQuestion) => {
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
                  {formatTimeString(q.duration)}
                </span>
              </>
            );
          },
        },
      };
      return questionCard;
    });
    setListInfo(rest);
    setQuestionList(_questionList);
    setLoading(false);
  };

  useEffect(() => {
    getGridQuestion();
  }, [pageSize, currentPageNum, filters]);

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

  const renderItemActions = (itemId: number) => {
    return (
      <>
        <IconButton
          sx={{
            alignSelf: 'center',
          }}
          disableRipple
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
          disableRipple
          onClick={() => {
            drawerRef.current?.open();
            setModifyInfo({
              title: `Edit Question  #${itemId}`,
              editId: itemId,
            });
          }}
        >
          <ModeEditIcon />
        </IconButton>
      </>
    );
  };

  const handleOnSearch = (searchVal: string) => {
    getGridQuestion(searchVal);
  };

  const handleFilter = useCallback(
    useDebounce((key: string, checked: IOption[]) => {
      setFilters((prevState: any) => {
        if (!checked.length) {
          delete prevState[key];
          return { ...prevState };
        } else {
          const checkedVals = checked.map((i) => i.key).join(',');
          return {
            ...prevState,
            [key]: checkedVals,
          };
        }
      });
    }, 500),
    [],
  );

  return (
    <Stack
      className="h-[inherit]"
      gridTemplateColumns={'1.5fr 1fr'}
      display={'grid'}
      gap={4}
    >
      <TFGrid
        data={_questionList}
        defaultPageSize={20}
        isLoading={_loading}
        handlePageChange={pageChange}
        currPage={currentPageNum}
        placeholder="Search question ..."
        itemActions={renderItemActions}
        handleOnSearch={handleOnSearch}
        handlePageSize={(pagesize: number) => setPageSize(pagesize)}
        totalItems={listInfo?.total}
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
              className="mr-3 !bg-primary text-base"
              disabled={isImportLoading}
            >
              Import
              <VisuallyHiddenInput
                type="file"
                accept="application/JSON "
                onChange={handleImport}
              />
            </Button>
            <TFButton
              requiredPermissions={[TFPermissions.CREATE_QUESTION]}
              userPermissions={authData?.userPermissions || []}
              variant="contained"
              className="!bg-primary text-base"
              onClick={(evt: React.MouseEvent) => {
                evt.preventDefault();
                updateData({
                  ...data,
                  pagination: {
                    pageNum: 1,
                  },
                });
                drawerRef.current?.open();
                setModifyInfo({ title: 'Create a Question' });
              }}
              startIcon={<AddBox />}
            >
              New Question
            </TFButton>
          </Box>
        </Box>
        <GridSettings ref={previewRef} onFilter={handleFilter} />
      </Stack>
      <TFDrawer
        ref={drawerRef}
        title={modifyInfo?.title || ''}
        width={`calc(100% - ${isNavCollapsed ? '66' : '240'}px)`}
      >
        {modifyInfo?.editId !== undefined && modifyInfo?.editId !== null ? (
          <EditQuestion
            onClose={() => {
              setModifyInfo(null);
              drawerRef.current?.close();
            }}
            questionId={modifyInfo?.editId}
          />
        ) : (
          <CreateQuestion
            onClose={() => {
              setModifyInfo(null);
              drawerRef.current?.close();
            }}
          />
        )}
      </TFDrawer>
    </Stack>
  );
};
export default Page;
