'use client';

import DataTable, { multipleLinesTypo } from '@/components/molecules/Grid';
import { ICorrectByLevel, IExamination, Level } from '@/constants/assessments';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { QuestionLevels } from '@/libs/definitions';
import { formatTimeString } from '@/libs/utils';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
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
  correctByLevel: ICorrectByLevel[];
  totalCorrect: number;
}

interface IStatistic {
  invited: number;
  completed: number;
  participation: number;
  processing: number;
  completedPercent: number;
  failed: number;
}

interface IAssessment {
  active: boolean;
  duration: number;
  level: string;
  questions: number;
  score: number;
}

export default function Page() {
  const pathname = usePathname().split('/');
  const assessmentId = pathname[pathname.length - 1];
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [examsInfo, setExamsInfo] = useState<Array<IExamResults>>([]);
  const [statistic, setStatistic] = useState<IStatistic>();
  const [assessment, setAssessment] = useState<IAssessment>();

  useEffect(() => {
    getExaminationByAssessment();
  }, []);

  const getStatus = (type: string) => {
    return {
      IN_PROGRESS: 'Processing',
      COMPLETED: 'Completed',
      EVALUATED: 'Failed',
    }[type];
  };

  const getExaminationByAssessment = async () => {
    const response: any = await ApiHook(
      Methods.GET,
      `/admin/examinations/assessments/${assessmentId}`,
    );
    const { examination, statistic, assessment } = response.data;

    const examinationsInfo: IExamResults[] = (
      examination as Array<IExamination>
    ).map((ex: IExamination) => {
      const _status = getStatus(ex.status) || 'Processing';

      return {
        id: ex.id,
        title: ex.assessment.name,
        level: ex.assessment.level,
        candidate: ex.email,
        empCode: ex.empCode,
        score: ex.score,
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
        correctByLevel: ex.correctByLevel
          .map((score: ICorrectByLevel) => {
            return {
              ...score,
              index: Object.keys(QuestionLevels).indexOf(score.level),
            };
          })
          .sort((a, b) => {
            return a.index - b.index;
          }),
        totalCorrect: ex.correctByLevel.reduce((acc, curr) => {
          console.log(curr);
          return acc + curr.scored;
        }, 0),
      };
    });

    setStatistic(statistic);
    setExamsInfo(examinationsInfo);
    setAssessment(assessment);
    toggleLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'empCode',
      flex: 1,
      headerName: 'Emp. Code',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: any) => multipleLinesTypo(params.row.empCode),
    },
    {
      field: 'levelQuestions',
      minWidth: 300,
      headerName: 'Level questions',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div className="flex w-full justify-center gap-4">
            {params.row.correctByLevel.map((summary: any) => {
              return (
                <div className="flex items-center">
                  <div className="text-center">
                    <div
                      className={`capitalize ${questionLevelColor[summary.level]}`}
                    >
                      {questionLevel[summary.level]}
                    </div>
                    <div>
                      <span>{summary.scored}/</span>
                      <span>{summary.total}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      field: 'corrects',
      minWidth: 100,
      headerName: 'Corrects',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => {
        return (
          <div>
            {params.row.totalCorrect}/{assessment?.questions}
          </div>
        );
      },
    },
    {
      field: 'scores',
      minWidth: 100,
      headerName: 'Scores',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => {
        return (
          <div>
            {params.row.score}/{assessment?.score}
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
      renderCell: (params: any) => {
        const lang = navigator.language,
          expiredDate = new Date(params.row.expireUtil).toLocaleDateString(
            lang,
          );
        return <span>{expiredDate}</span>;
      },
    },
  ];

  const levelColor: any = {
    [Level.Junior]: 'text-green-500',
    [Level.Intermediate]: 'text-yellow-500',
    [Level.Senior]: 'text-red-500',
  };

  const questionLevel: any = {
    [QuestionLevels.JUNIOR]: 'Junior',
    [QuestionLevels.INTERMEDIATE]: 'Intermediate',
    [QuestionLevels.SENIOR]: 'Senior',
  };

  const questionLevelColor: any = {
    [QuestionLevels.JUNIOR]: 'text-green-500',
    [QuestionLevels.INTERMEDIATE]: 'text-yellow-500',
    [QuestionLevels.SENIOR]: 'text-red-500',
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className=" col-span-2 bg-white">
        <DataTable
          columns={columns}
          rows={examsInfo}
          loading={isLoading}
          height="h-[calc(100vh_-_96px)]"
          getRowClassName={(params: any) =>
            params?.indexRelativeToCurrentPage % 2 === 0
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
              <div className="text-lg font-medium">{statistic?.invited}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Completed</div>
              <div className="text-lg font-medium">{statistic?.completed}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Participation</div>
              <div className="text-lg font-medium">
                {statistic?.participation}
              </div>
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
                <span className="ml-2  text-xs font-medium">
                  {statistic?.processing}%
                </span>
              </div>
              <div>
                <Brightness1Icon
                  sx={{
                    color: '#2e7d32',
                    fontSize: 10,
                  }}
                />
                <span className="ml-1 text-xs text-gray-500">Completed</span>
                <span className="ml-2 text-xs font-medium">
                  {statistic?.completedPercent}%
                </span>
              </div>
              <div>
                <Brightness1Icon
                  sx={{
                    color: '#d32f2f',
                    fontSize: 10,
                  }}
                />
                <span className="ml-1 text-xs text-gray-500">Failed</span>
                <span className="ml-2 text-xs font-medium">
                  {statistic?.failed}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded border border-gray-200 bg-white px-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <Brightness1Icon
                sx={{
                  color: assessment?.active ? '#7bbd1e' : '#d1d5db',
                  fontSize: 16,
                }}
              />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Status</div>
              <div className="text-xs text-gray-500">
                {assessment?.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <QuestionAnswerIcon sx={{ fontSize: 16 }} />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Questions</div>
              <div className="text-xs text-gray-500">
                {assessment?.questions} Questions added
              </div>
            </div>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <KeyboardDoubleArrowUpIcon sx={{ fontSize: 16 }} />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Level</div>
              <div
                className={`text-xs text-gray-500 ${levelColor[assessment?.level || Level.Junior]}`}
              >
                {assessment?.level}
              </div>
            </div>
          </div>
          <div className="flex items-center border-b border-gray-200 py-2">
            <div className="mr-4 ">
              <AlarmOnIcon sx={{ fontSize: 16 }} />
            </div>
            <div>
              <div className="text-sm font-medium">Assessment Duration</div>
              <div className="text-xs text-gray-500">
                {formatTimeString(assessment?.duration || 30)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
