'use client';

import DashboardCard from '@/app/administration/(overview)/components/dashboardCard';
import LinearProgressBar from '@/components/atoms/LinearProgressBar';
import { multipleLinesTypo } from '@/components/molecules/Grid';
import { IAssessment, IExamination } from '@/constants/assessments';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

interface IExamResults {
  id: number;
  title: string;
  level: string;
  candidate: string;
  result: {
    score: number | string;
    status: string;
  } | null;
  status: {
    label: string;
    color: string;
  };
}

export default function DashboardGrid() {
  const [isLoading, toggleLoading] = useState<boolean>(false);
  const [examsInfo, setExamsInfo] = useState<Array<IExamResults>>([]);
  const [assessments, setAssessments] = useState<IAssessment[]>([]);

  const getStatus = (type: string) => {
    return {
      IN_PROGRESS: 'Processing',
      COMPLETED: 'Completed',
      EVALUATED: 'Failed',
    }[type];
  };

  const getExaminations = async () => {
    toggleLoading(true);
    const response = await ApiHook(Methods.GET, '/examinations');
    const examinationsInfo: IExamResults[] = (
      response.data as Array<IExamination>
    ).map((ex: IExamination) => {
      const _status = getStatus(ex.status) || 'Processing';
      return {
        id: ex.id,
        title: ex.assessment.name,
        level: ex.assessment.level,
        candidate: ex.email,
        result: {
          score: ex.score || 0,
          status: _status,
        },
        expireUtil: ex.expireUtil,
        status: {
          label: _status,
          color:
            _status === 'Processing'
              ? 'warning'
              : _status === 'Completed'
                ? 'info'
                : 'error',
        },
      };
    });
    toggleLoading(false);
    setExamsInfo(examinationsInfo);
  };

  const getAssessement = async () => {
    toggleLoading(true);
    const response: any = await ApiHook(Methods.GET, '/assessments');
    setAssessments(response.data);
    console.log(response.data);
    toggleLoading(false);
  };

  useEffect(() => {
    // getExaminations();
    getAssessement();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ExamID',
      disableColumnMenu: true,
      width: 120,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 0.3,
      renderCell: (params) => multipleLinesTypo(params.row.title),
    },
    {
      field: 'level',
      headerName: 'Level',
      flex: 0.3,
      renderCell: (params) => multipleLinesTypo(params.row.level),
    },
    {
      field: 'candidate',
      headerName: 'Candidate',
      flex: 0.5,
      renderCell: (params) => multipleLinesTypo(params.row.candidate),
    },
    {
      field: 'result',
      headerName: 'Result',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <LinearProgressBar
            value={params.row.result.score}
            status={params.row.result.status}
          />
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.4,
      renderCell: (params) => {
        return (
          <div>
            <Chip
              label={params.row.status.label}
              color={params.row.status.color}
            />
          </div>
        );
      },
    },
    {
      field: 'expireUtil',
      headerName: 'Expire Time',
      flex: 0.5,
      renderCell: (params) => {
        const lang = navigator.language,
          expiredDate = new Date(params.row.expireUtil).toLocaleDateString(
            lang,
          );
        return <span>{expiredDate}</span>;
      },
    },
  ];

  return (
    <div className="col-span-2 grid grid-cols-2 gap-4 rounded">
      {assessments.map((assessment) => {
        return (
          <DashboardCard
            name={assessment.name}
            level={assessment.level}
            questions={assessment.assessmentQuestionMapping.length}
            duration="25 mins"
            status="active"
          />
        );
      })}
    </div>
  );
  // <DataTable columns={columns} rows={examsInfo} loading={isLoading} />;
}
