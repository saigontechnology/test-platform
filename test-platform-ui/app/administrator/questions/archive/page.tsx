/* eslint-disable @next/next/no-async-client-component */
'use client';

import DataTable, { multipleLinesTypo } from '@/app/components/molecules/Grid';
import { questionRows } from '@/app/constants/questions';
import { Inventory, ModeEdit } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import clsx from 'clsx';

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
            onClick={() => null}
          />
          <Button
            className="w-10 [&>span]:m-0"
            title="Archive"
            variant="outlined"
            startIcon={<Inventory />}
            onClick={() => null}
          />
        </Box>
      );
    },
  },
];

export default function ArchivedQuestions() {
  return (
    <>
      <Typography component="h1" className={`text-xl md:text-2xl`}>
        Archived Questions
      </Typography>
      <Divider className="my-10" />
      <DataTable rows={questionRows} columns={columns} />
    </>
  );
}
