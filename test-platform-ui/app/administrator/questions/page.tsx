'use client';

import CustomModal, {
  CustomModalHandler,
} from '@/app/components/molecules/CustomModal';
import DataTable, { multipleLinesTypo } from '@/app/components/molecules/Grid';
import { Chip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { ModeEdit, Inventory, AddBox } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { IResponseQuestion } from '@/app/lib/apis/Interfaces';
import clsx from 'clsx';

interface IQuestion {
  id: number;
  title: string;
  content: string;
  categories: string[];
  answers: number[];
  options: string[];
}

let externalRoute = null;

//#region : Temporary definition Questions list's columns:
export const columns: GridColDef[] = [
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
                  'bg-blue-500 text-white': params.row.answers?.includes(indx),
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
              externalRoute.push(
                `/administrator/questions/edit/${params.row.id}`,
              )
            }
          />
          <Button
            className="w-10 [&>span]:m-0"
            title="Archive"
            variant="outlined"
            startIcon={<Inventory />}
            onClick={() => console.log('handle archive question: ', params.row)}
          />
        </Box>
      );
    },
  },
];
//#endregion

export default function Page() {
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const router = (externalRoute = useRouter());
  const modalRef = React.useRef<CustomModalHandler>(null);

  const getQuestionsList = async () => {
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
    getQuestionsList();
  }, []);

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
            // modalRef.current?.open()
          }}
          startIcon={<AddBox className="!text-2xl" />}
        >
          Create New Question
        </Button>
      </Box>
      <Divider className="my-10" />
      <DataTable rows={questionList} columns={columns} />
      {/* Pending Modal */}
      {/* <CustomModal ref={modalRef} title="Create New Question">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomSingleSelect label="Category" options={CategoriesOptions} />
          </Grid>
          <Grid item xs={12}>
            <CustomRadioGroup />
          </Grid>
        </Grid>
        <Box className="mt-[20px] text-right">
          <Button
            onClick={() => modalRef.current?.close()}
            variant="outlined"
            className="mr-[10px]"
          >
            Cancel
          </Button>
          <Button variant="contained">Save</Button>
        </Box>
      </CustomModal> */}
    </Box>
  );
}
