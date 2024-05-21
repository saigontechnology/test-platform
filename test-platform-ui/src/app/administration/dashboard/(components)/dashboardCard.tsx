import { Level } from '@/constants/assessments';
import { ROUTE_KEY } from '@/constants/routePaths';
import { formatTimeString } from '@/libs/utils';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Link from 'next/link';

export default function DashboardCard(props: any) {
  const { name, level, questions, duration, active, id } = props;

  const levelColor: any = {
    [Level.Junior]: 'text-green-500',
    [Level.Intermediate]: 'text-yellow-500',
    [Level.Senior]: 'text-red-500',
  };

  return (
    <Link
      href={`${ROUTE_KEY.ADMINISTRATION_DASHBOARD_ASSESSMENT}/${id}`}
      className="cursor-pointer rounded border border-gray-200 p-4"
    >
      <p className="line-clamp-1 text-lg font-medium leading-8" title={name}>
        {name}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-sm leading-6">
          <Brightness1Icon
            sx={{
              color: active ? '#7bbd1e' : '#d1d5db',
              fontSize: 20,
            }}
          />
          <span className="ml-2 font-medium capitalize">
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="text-sm leading-6">
          <KeyboardDoubleArrowUpIcon sx={{ fontSize: 20 }} />
          <span className="ml-2 text-gray-500">Level: </span>
          <span className={`font-medium ${levelColor[level]}`}>{level}</span>
        </div>
        <div className="text-sm leading-6">
          <QuestionAnswerIcon sx={{ fontSize: 20 }} />
          <span className="ml-2 text-gray-500">Questions: </span>
          <span className="font-medium">{questions}</span>
        </div>
        <div className="text-sm leading-6">
          <AlarmOnIcon sx={{ fontSize: 20 }} />
          <span className="ml-2 text-gray-500">Duration: </span>
          <span className="font-medium">{formatTimeString(duration)}</span>
        </div>
      </div>
    </Link>
  );
}
