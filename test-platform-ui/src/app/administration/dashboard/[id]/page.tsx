'use client';

import LinearProgressBar from '@/components/atoms/LinearProgressBar';
import DataTable, { multipleLinesTypo } from '@/components/molecules/Grid';
import { IExamination } from '@/constants/assessments';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { usePathname } from 'next/navigation';
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

export default async function Page() {
  const pathname = usePathname().split('/');
  const assessmentId = pathname[pathname.length - 1];
  const [isLoading, toggleLoading] = useState<boolean>(false);
  const [examsInfo, setExamsInfo] = useState<Array<IExamResults>>([]);

  useEffect(() => {
    if (assessmentId) {
      getExaminationByAssessment();
    }
  }, []);

  const getStatus = (type: string) => {
    return {
      IN_PROGRESS: 'Processing',
      COMPLETED: 'Completed',
      EVALUATED: 'Failed',
    }[type];
  };

  const getExaminationByAssessment = async () => {
    toggleLoading(true);
    const response = await ApiHook(
      Methods.GET,
      `/examinations/assessments/${assessmentId}`,
    );
    const examinationsInfo: IExamResults[] = (
      response.data as Array<IExamination>
    ).map((ex: IExamination) => {
      const _status = getStatus(ex.status) || 'Processing';
      return {
        id: ex.id,
        title: ex.assessment.name,
        level: ex.assessment.level,
        candidate: ex.email,
        empCode: ex.empCode,
        result: {
          score: ex.score || 0,
          status: _status,
        },
        expireUtil: ex.expireUtil,
        status: {
          label: _status,
          color:
            _status === 'Processing'
              ? 'info'
              : _status === 'Completed'
                ? 'success'
                : 'error',
        },
      };
    });
    toggleLoading(false);
    setExamsInfo(examinationsInfo);
  };

  const columns: GridColDef[] = [
    {
      field: 'empCode',
      flex: 1,
      headerName: 'Emp Code',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => multipleLinesTypo(params.row.empCode),
    },
    {
      field: 'status',
      minWidth: 150,
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
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
      minWidth: 150,
      headerName: 'Due date',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const lang = navigator.language,
          expiredDate = new Date(params.row.expireUtil).toLocaleDateString(
            lang,
          );
        return <span>{expiredDate}</span>;
      },
    },
    {
      field: 'result',
      minWidth: 250,
      headerName: 'Result',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        return (
          <LinearProgressBar
            value={params.row.result.score}
            status={params.row.result.status}
          />
        );
      },
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className=" col-span-2 bg-white">
        <DataTable
          columns={columns}
          rows={examsInfo}
          loading={isLoading}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? 'bg-gray-100'
              : 'bg-white'
          }
        />
      </div>
      <div>
        <div className="rounded border border-b border-gray-200 bg-white py-4">
          <div className="grid grid-cols-3 justify-between border-b border-gray-200 px-4 pb-4">
            <div>
              <div className="text-xs text-gray-500">Invited</div>
              <div className="text-lg font-medium">0</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Completed</div>
              <div className="text-lg font-medium">0</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Participation</div>
              <div className="text-lg font-medium">0</div>
            </div>
          </div>
          <div className="px-4 pt-4">
            <div className="text-sm font-medium">Test Performance</div>
            <div className="lg:flex lg:justify-between">
              <div>
                <Brightness1Icon
                  sx={{
                    color: '#3b82f6',
                    fontSize: 10,
                  }}
                />
                <span className="ml-1 text-xs text-gray-500">Processing</span>
                <span className="ml-2  text-xs font-medium">80%</span>
              </div>
              <div>
                <Brightness1Icon
                  sx={{
                    color: '#2e7d32',
                    fontSize: 10,
                  }}
                />
                <span className="ml-1 text-xs text-gray-500">Completed</span>
                <span className="ml-2 text-xs font-medium">0%</span>
              </div>
              <div>
                <Brightness1Icon
                  sx={{
                    color: '#d32f2f',
                    fontSize: 10,
                  }}
                />
                <span className="ml-1 text-xs text-gray-500">Failed</span>
                <span className="ml-2 text-xs font-medium">20%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded border border-gray-200 bg-white px-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <Brightness1Icon
                sx={{
                  color: '#7bbd1e',
                  fontSize: 16,
                }}
              />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Status</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <QuestionAnswerIcon sx={{ fontSize: 16 }} />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Questions</div>
              <div className="text-xs text-gray-500">25 Questions added</div>
            </div>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <KeyboardDoubleArrowUpIcon sx={{ fontSize: 16 }} />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Level</div>
              <div className="text-xs text-gray-500">Intermediate</div>
            </div>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <AlarmOnIcon sx={{ fontSize: 16 }} />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Duration</div>
              <div className="text-xs text-gray-500">25 mins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
