'use client';

import CustomRadioGroup from '@/app/components/atoms/CustomRadioGroup';
import CustomSingleSelect from '@/app/components/atoms/CustomSingleSelect';
import CustomModal, {
  CustomModalHandler,
} from '@/app/components/molecules/CustomModal';
import DataTable, { multipleLinesTypo } from '@/app/components/molecules/Grid';
import { CategoriesOptions, questionRows } from '@/app/constants/questions';
import { Chip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { ModeEdit, Inventory, AddBox } from '@mui/icons-material';
import React from 'react';

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
          {params.row.catgories.map((cate: any, indx: number) => {
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
          {params.row.answers.map((answ: any, indx: number) => {
            return (
              <Chip
                key={`answer-${indx}`}
                label={answ}
                variant="outlined"
                onDelete={() => console.log('handle delete: ', params)}
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
            onClick={() => console.log('handle edit question: ', params.row)}
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
  const router = useRouter();
  const modalRef = React.useRef<CustomModalHandler>(null);

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
      <Box>
        <DataTable rows={questionRows} columns={columns} />
      </Box>
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
