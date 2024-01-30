'use client';

import CustomModal, {
  CustomModalHandler,
} from '@/app/components/molecules/CustomModal';
import DataTable, { multipleLinesTypo } from '@/app/components/molecules/Grid';
import { IResponseQuestion } from '@/app/constants/questions';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { AddBox, Inventory, ModeEdit } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Chip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface IQuestion {
  id: number;
  title: string;
  content: string;
  categories: string[];
  answers: number[];
  options: string[];
}

export default function Page() {
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const onDeleteQuestion = React.useRef<number>(0);
  const router = useRouter();
  const modalRef = React.useRef<CustomModalHandler>(null);

  const getGridQuestion = async () => {
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
      };
    });
    setQuestionList(_questionList);
  };

  useEffect(() => {
    getGridQuestion();
  }, []);

  const handleDeleteQuestion = async (questionId: number) => {
    const { error } = await ApiHook(Methods.DELETE, `/questions/${questionId}`);
    // Handle response
    if (!error) {
      getGridQuestion();
    } else {
      alert(`Can not delete question ${questionId}`);
    }
    modalRef.current?.close();
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
      sortable: false,
      width: 30,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 0.6,
      renderCell: (params) => multipleLinesTypo(params.row.title),
    },
    {
      field: 'content',
      headerName: 'Question Content',
      flex: 0.8,
      renderCell: (params) => multipleLinesTypo(params.row.content),
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
      headerName: 'Answers',
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box className="grid gap-1">
            {params.row.options?.map((answ: any, indx: number) => {
              return (
                <Chip
                  className={clsx('w-fit max-w-sm', {
                    'bg-blue-500 text-white':
                      params.row.answers?.includes(indx),
                  })}
                  key={`answer-${indx}`}
                  label={answ}
                  variant="outlined"
                  // onDelete={() => console.log('handle delete: ', params)}
                />
              );
            })}
          </Box>
        );
      },
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.3,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box className="grid gap-1">
            <Button
              className="w-10 [&>span]:m-0"
              title="Edit"
              variant="contained"
              startIcon={<ModeEdit />}
              onClick={() =>
                router.push(`/administrator/questions/${params.row.id}`)
              }
            />
            <Button
              className="w-10 [&>span]:m-0"
              title="Archive"
              variant="outlined"
              startIcon={<Inventory />}
              onClick={() => {
                onDeleteQuestion.current = params.row.id;
                modalRef.current?.open();
              }}
            />
          </Box>
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
        <Button
          className="text-xl"
          variant="contained"
          onClick={(evt: React.MouseEvent) => {
            evt.preventDefault();
            router.push('/administrator/questions/create');
          }}
          startIcon={<AddBox className="!text-2xl" />}
        >
          New Question
        </Button>
      </Box>
      <Divider className="my-10" />
      <DataTable rows={questionList} columns={columns} />
      <CustomModal ref={modalRef} title={''}>
        <ModalContent />
      </CustomModal>
    </Box>
  );
}
