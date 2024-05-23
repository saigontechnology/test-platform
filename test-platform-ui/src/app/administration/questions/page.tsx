'use client';

import CustomModal, {
  CustomModalHandler,
} from '@/components/molecules/CustomModal';
import DataTable, { multipleLinesTypo } from '@/components/molecules/Grid';
import { IResponseQuestion } from '@/constants/questions';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { DataContext } from '@/libs/contextStore';
import { QuestionLevel } from '@/libs/definitions';
import { showNotification } from '@/libs/toast';
import { handleMappingImportData, isStringHTML } from '@/libs/utils';
import { AddBox, Delete, ModeEdit } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

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
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const onDeleteQuestion = React.useRef<number>(0);
  const router = useRouter();
  const modalRef = React.useRef<CustomModalHandler>(null);
  const [isImportLoading, setImportLoading] = useState<boolean>(false);

  const { data, updateData } = useContext(DataContext);

  const getGridQuestion = async () => {
    setLoading(true);
    const _questions = await ApiHook(Methods.GET, '/admin/questions');
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
      };
    });
    setQuestionList(_questionList);
    setLoading(false);
  };

  useEffect(() => {
    getGridQuestion();
  }, []);

  const handleDeleteQuestion = async (questionId: number) => {
    const { error } = await ApiHook(Methods.DELETE, `/admin/questions/${questionId}`);
    // Handle response
    if (!error) {
      getGridQuestion();
    } else {
      alert(`Can not delete question ${questionId}`);
    }
    modalRef.current?.close();
  };

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

  const ModalContent = () => {
    return (
      <Box className="grid">
        <h2 id="parent-modal-title">{`Deleting Question ID ${onDeleteQuestion.current}`}</h2>
        <p id="parent-modal-description" className="mt-3">
          Are you sure want to delete selected question ? Question will be
          delete permanently.
        </p>
        <Box className="inline-flex gap-10">
          <Button
            className="mt-5 w-full content-end"
            title="Delete"
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={() => modalRef.current?.close()}
          >
            Cancel
          </Button>
          <Button
            className="mt-5 w-full content-end"
            title="Delete"
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            onClick={() => handleDeleteQuestion(onDeleteQuestion.current)}
          >
            Delete
          </Button>
        </Box>
      </Box>
    );
  };

  //#region : Temporary definition Questions list's columns:
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      disableColumnMenu: true,
      width: 70,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 0.6,
      renderCell: (params) => multipleLinesTypo(params.row.title),
    },
    {
      field: 'level',
      headerName: 'Standard',
      flex: 0.3,
      renderCell: (params) => {
        const level = QuestionLevel.find(
          (lvl) => lvl.value === params.row.level,
        );
        return (
          <Box className="grid gap-1">
            {level ? <Chip label={level?.label} /> : null}
          </Box>
        );
      },
    },
    {
      field: 'categories',
      headerName: 'Categories',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Box className="grid gap-1">
            {params.row.categories?.map((cate: any, indx: number) => {
              return <Chip key={`cate-${indx}`} label={cate} />;
            })}
          </Box>
        );
      },
    },
    {
      field: 'answers',
      headerName: 'Correct answer',
      sortable: false,
      flex: 0.7,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box className="grid gap-1">
            {params.row.options?.map((answ: any, indx: number) => {
              const _answ = isStringHTML(answ) ? (
                <div>{String.fromCharCode(indx + 'A'.charCodeAt(0))}</div>
              ) : (
                answ
              );
              if (params.row.answers?.includes(indx)) {
                return (
                  <Chip
                    className={clsx('w-fit max-w-sm', {
                      'bg-blue-500 text-white':
                        params.row.answers?.includes(indx),
                    })}
                    key={`answer-${indx}`}
                    label={_answ}
                    variant="outlined"
                  />
                );
              } else {
                return null;
              }
            })}
          </Box>
        );
      },
      valueGetter: (params: GridValueGetterParams) =>
        params.row.options.join('\t'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.3,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              title="Edit"
              onClick={() =>
                router.push(
                  `${ROUTE_KEY.ADMINISTRATION_QUESTIONS}/${params.row.id}`,
                )
              }
            >
              <ModeEdit />
            </IconButton>
            <IconButton
              title="Delete"
              className="ml-3"
              onClick={() => {
                onDeleteQuestion.current = params.row.id;
                modalRef.current?.open();
              }}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];
  //#endregion

  return (
    <Box>
      <Box className="flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Questions
        </Typography>
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
      <Divider className="my-10" />
      <DataTable
        rows={questionList}
        columns={columns}
        loading={loading}
        height="h-[calc(100vh_-_215px)]"
      />
      <CustomModal ref={modalRef} title={''}>
        <ModalContent />
      </CustomModal>
    </Box>
  );
};

export default Page;
