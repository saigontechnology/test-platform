import { AssessmentLevels } from '@/constants/assessments';
import { formatTimeString } from '@/libs/utils';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Link from 'next/link';

interface IDashboardCardProps {
  id: number;
  name: string;
  level: string;
  questions: number;
  duration: number;
  score: number;
  href: string;
  hasDelete?: boolean;
  onDelete?: (id: number) => void;
}

export default function DashboardCard(props: IDashboardCardProps) {
  const {
    id,
    name,
    level,
    questions,
    duration,
    score,
    href,
    hasDelete = false,
    onDelete = () => {},
  } = props;

  const levelColor: any = {
    [AssessmentLevels.JUNIOR]: 'text-green-500',
    [AssessmentLevels.INTERMEDIATE]: 'text-yellow-500',
    [AssessmentLevels.SENIOR]: 'text-orange-500',
    [AssessmentLevels.PRINCIPAL]: 'text-red-500',
  };

  const assessmentLevel: any = {
    [AssessmentLevels.JUNIOR]: 'Junior',
    [AssessmentLevels.INTERMEDIATE]: 'Intermediate',
    [AssessmentLevels.SENIOR]: 'Senior',
    [AssessmentLevels.PRINCIPAL]: 'Principal',
  };

  const handleDelete = (event: any, id: number) => {
    event.preventDefault();
    onDelete(id);
  };

  return (
    <Link
      href={href}
      className="cursor-pointer rounded border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between">
        <p
          className="mr-4 line-clamp-1 flex-1 text-lg font-medium leading-8"
          title={name}
        >
          {name}
        </p>
        {hasDelete ? (
          <CloseIcon
            sx={{
              fontSize: 18,
            }}
            className="hover:text-red-500"
            onClick={(event: any) => handleDelete(event, id)}
          />
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-sm leading-6">
          <KeyboardDoubleArrowUpIcon sx={{ fontSize: 20 }} />
          <span className="ml-2 text-gray-500">Level: </span>
          <span className={`font-medium ${levelColor[level]}`}>
            {assessmentLevel[level]}
          </span>
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
        <div className="text-sm leading-6">
          <NoteAltIcon sx={{ fontSize: 20 }} />
          <span className="ml-2 text-gray-500">Score: </span>
          <span className="font-medium">{score}</span>
        </div>
      </div>
    </Link>
  );
}
