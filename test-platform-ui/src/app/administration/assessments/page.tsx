'use client';

import { multipleLinesTypo } from '@/components/molecules/Grid';
import { IAssessment } from '@/constants/assessments';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { DataContext } from '@/libs/contextStore';
import { showNotification } from '@/libs/toast';
import { sendAssessmentInvitationSchema } from '@/validations/assessment';
import { yupResolver } from '@hookform/resolvers/yup';
import { Delete, ModeEdit, Send } from '@mui/icons-material';
import { Chip, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import AssessmentCard from './(components)/assessmentCard';

let externalRoute = null;

export default function EditAssessment() {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = (externalRoute = useRouter());
  const sendInviteModalRef = useRef<any>(null);
  const rowIdValueRef = useRef<any>(null);

  const { data, updateData } = useContext(DataContext);

  const sendInviteForm = useForm<{
    email: string[];
  }>({
    defaultValues: {
      email: [],
    },
    resolver: yupResolver(sendAssessmentInvitationSchema),
  });

  const selectedEmails = sendInviteForm.watch('email');

  const getAssessments = async () => {
    const response: any = await ApiHook(Methods.GET, '/assessments');
    setAssessments(response.data);
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
    const formData: {
      email: string[];
    } = sendInviteForm.getValues();
    const { error } = await ApiHook(Methods.POST, `/examinations/invite`, {
      data: { ...formData, assessmentId: rowIdValueRef.current },
    });
    if (!error) {
      showNotification('Send assessment invitation successfully', 'success');
      sendInviteModalRef?.current.close();
    }
  };

  const goToCreate = (e) => {
    updateData({
      ...data,
      pagination: {
        pageNum: 1,
      },
    });
    router.push(ROUTE_KEY.ADMINISTRATION_ASSESSMENTS_CREATE);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      disableColumnMenu: true,
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.5,
      renderCell: (params) => multipleLinesTypo(params.row.name),
    },
    {
      field: 'level',
      headerName: 'Level',
      flex: 0.3,
      renderCell: (params) => multipleLinesTypo(params.row.level),
    },
    {
      field: 'categories',
      headerName: 'Categories',
      flex: 0.6,
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
    // <Box>
    //   <Box className="flex items-center justify-between">
    //     <Typography component="h1" className={`text-xl md:text-2xl`}>
    //       Assessments
    //     </Typography>
    //     <Button
    //       variant="contained"
    //       onClick={(evt: React.MouseEvent) => {
    //         evt.preventDefault();
    //         updateData({
    //           ...data,
    //           pagination: {
    //             pageNum: 1,
    //           },
    //         });
    //         router.push(ROUTE_KEY.ADMINISTRATION_ASSESSMENTS_CREATE);
    //       }}
    //       startIcon={<AddBox />}
    //     >
    //       New Assessment
    //     </Button>
    //   </Box>
    //   <Divider className="my-10" />
    //   <DataTable rows={assessments} columns={columns} loading={loading} />

    //   {/* Send invitation modal */}
    //   <CustomModal ref={sendInviteModalRef} title="Send Invitation">
    //     <FormProvider {...sendInviteForm}>
    //       <Box className="grid w-[500px]">
    //         <FormControl variant="standard" className="my-4">
    //           <AccordionExpandIcon />
    //         </FormControl>
    //         <Box className="text-right">
    //           <Button
    //             variant="contained"
    //             onClick={sendInviteForm.handleSubmit(handleSendInvite)}
    //             disabled={!selectedEmails.length}
    //           >
    //             Send
    //           </Button>
    //         </Box>
    //       </Box>
    //     </FormProvider>
    //   </CustomModal>
    // </Box>
    <div className="bg-white p-4">
      <div className="flex justify-end">
        <button
          onClick={goToCreate}
          className="flex justify-end rounded bg-primary px-8 py-2 text-white"
        >
          New Assessment
        </button>
      </div>

      <div className="col-span-2 grid grid-cols-1 gap-4 rounded md:grid-cols-2 lg:grid-cols-3">
        {assessments.map((assessment) => {
          return (
            // <DashboardCard
            //   name={assessment.name}
            //   level={assessment.level}
            //   questions={assessment.assessmentQuestionMapping.length}
            //   duration="25 mins"
            //   status="active"
            //   id={assessment.id}
            //   key={assessment.id}
            // />
            <AssessmentCard
              name={assessment.name}
              level={assessment.level}
              questions={assessment.assessmentQuestionMapping.length}
              duration={assessment.duration}
              status={assessment.active}
              id={assessment.id}
              key={assessment.id}
            />
          );
        })}
      </div>
    </div>
  );
}
