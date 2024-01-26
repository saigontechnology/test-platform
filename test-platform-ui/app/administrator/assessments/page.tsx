'use client';

import DataTable, { multipleLinesTypo } from '@/app/components/molecules/Grid';
import { IAssessment } from '@/app/constants/assessments';
import { ROUTE_KEY } from '@/app/constants/routePaths';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { AddBox, Delete, ModeEdit } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

let externalRoute = null;

export default function Page() {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const router = (externalRoute = useRouter());

  const getAssessments = async () => {
    const resp = await ApiHook(Methods.GET, '/assessments');
    const assessmentsData: IAssessment[] = (
      resp.data as Array<IAssessment>
    ).map((q: IAssessment) => {
      return {
        id: q.id,
        level: q.level,
        name: q.name,
        createdAt: q.createdAt,
      };
    });
    setAssessments(assessmentsData);
  };

  useEffect(() => {
    getAssessments();
  }, []);

  const handleEdit = (e: React.MouseEvent, row: IAssessment) => {
    e.stopPropagation();
    externalRoute.push(
      `${ROUTE_KEY.ADMINISTRATION_ASSESSMENTS_EDIT}/${row.id}`,
    );
  };

  const handleDelete = async (e: React.MouseEvent, row: IAssessment) => {
    e.stopPropagation();
    await ApiHook(Methods.DELETE, `/assessments/${row.id}`);
    getAssessments();
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      disableColumnMenu: true,
      sortable: false,
      width: 30,
    },
    {
      field: 'level',
      headerName: 'Level',
      flex: 0.6,
      renderCell: (params) => multipleLinesTypo(params.row.level),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.8,
      renderCell: (params) => multipleLinesTypo(params.row.name),
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
            <IconButton onClick={(e) => handleEdit(e, params.row)}>
              <ModeEdit />
            </IconButton>
            <IconButton
              className="ml-3"
              onClick={(e) => handleDelete(e, params.row)}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Box>
      <Box className="flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Assessments
        </Typography>
        <Button
          className="text-xl"
          variant="contained"
          onClick={(evt: React.MouseEvent) => {
            evt.preventDefault();
            router.push(ROUTE_KEY.ADMINISTRATION_ASSESSMENTS_CREATE);
          }}
          startIcon={<AddBox className="!text-2xl" />}
        >
          New Assessment
        </Button>
      </Box>
      <Divider className="my-10" />
      <DataTable rows={assessments} columns={columns} />
    </Box>
  );
}
