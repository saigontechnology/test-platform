'use client';

import CustomTextField from '@/app/components/atoms/CustomTextField';
import CustomModal from '@/app/components/molecules/CustomModal';
import DataTable, { multipleLinesTypo } from '@/app/components/molecules/Grid';
import { IAssessment } from '@/app/constants/assessments';
import { ROUTE_KEY } from '@/app/constants/routePaths';
import ApiHook, { Methods } from '@/app/lib/apis/ApiHook';
import { showNotification } from '@/app/lib/toast';
import { sendAssessmentInvitationSchema } from '@/app/validations/assessment';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddBox, Delete, ModeEdit, Send } from '@mui/icons-material';
import { FormControl, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

let externalRoute = null;

export default function EditAssessment() {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const router = (externalRoute = useRouter());
  const sendInviteModalRef = useRef<any>(null);
  const rowIdValueRef = useRef<any>(null);

  const sendInviteForm = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(sendAssessmentInvitationSchema),
  });

  const getAssessments = async () => {
    const resp = await ApiHook(Methods.GET, '/assessments');
    const assessmentsData: any = (resp.data as Array<IAssessment>).map(
      (q: IAssessment) => {
        return {
          id: q.id,
          level: q.level,
          name: q.name,
          createdAt: q.createdAt,
        };
      },
    );
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
    const { error } = await ApiHook(Methods.DELETE, `/assessments/${row.id}`);
    if (!error) {
      showNotification('Delete assessment successfully', 'success');
      getAssessments();
    }
  };

  const handleInvite = async (e: React.MouseEvent, row: IAssessment) => {
    e.stopPropagation();
    sendInviteForm.reset();
    rowIdValueRef.current = row.id;
    sendInviteModalRef?.current.open();
  };

  const handleSendInvite = async () => {
    const formData = sendInviteForm.getValues();
    const { error } = await ApiHook(Methods.POST, `/examinations/invite`, {
      data: { ...formData, assessmentId: rowIdValueRef.current },
    });
    if (!error) {
      showNotification('Send assessment invitation successfully', 'success');
      sendInviteModalRef?.current.close();
    }
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
            <IconButton
              className="ml-3"
              onClick={(e) => handleInvite(e, params.row)}
            >
              <Send />
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
      <CustomModal ref={sendInviteModalRef} title="Send Invitation">
        <FormProvider {...sendInviteForm}>
          <Box className="grid w-[300px]">
            <FormControl variant="standard" className="my-4">
              <Typography className="font-semibold">Email</Typography>
              <CustomTextField name="email" />
            </FormControl>
            <Box className="text-right">
              <Button
                variant="contained"
                onClick={sendInviteForm.handleSubmit(handleSendInvite)}
              >
                Send
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </CustomModal>
    </Box>
  );
}
