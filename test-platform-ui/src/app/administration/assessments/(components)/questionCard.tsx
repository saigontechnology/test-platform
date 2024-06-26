'use client';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { QuestionLevels, QuestionType } from '@/libs/definitions';
import AddIcon from '@mui/icons-material/Add';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import RemoveIcon from '@mui/icons-material/Remove';

interface IQuestionCardProps {
  id: number;
  index: number;
  selected: number;
  description: string;
  category: string;
  level: string;
  type: string;
  duration: number;
  hasDeleted?: boolean;
  onSelect: (id: number) => void;
  onAdd?: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function QuestionCard(props: IQuestionCardProps) {
  const {
    id,
    index,
    selected,
    description,
    category,
    level,
    type,
    duration,
    hasDeleted = true,
    onSelect,
    onAdd = () => {},
    onDelete,
  } = props;

  const questionType: any = {
    [QuestionType.SINGLE_CHOICE]: 'Single Choice',
    [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
  };

  const questionLevel: any = {
    [QuestionLevels.JUNIOR]: 'Junior',
    [QuestionLevels.INTERMEDIATE]: 'Intermediate',
    [QuestionLevels.SENIOR]: 'Senior',
    [QuestionLevels.PRINCIPAL]: 'Principal',
  };

  const handleIndex = (index: number) => {
    return index.toString().padStart(3, '0');
  };

  return (
    <div className="mt-4 flex cursor-pointer items-center pr-4">
      <div className="px-4 text-sm text-gray-400">#{handleIndex(index)}</div>
      <div
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border  bg-white p-4 text-sm ${id === selected ? 'border-primary' : 'border-gray-200'}`}
        onClick={() => {
          onSelect(id);
        }}
      >
        <div>
          <RichTextArea
            key={index}
            name={description}
            data={description}
            isReadOnly={true}
          />
          <div className="flex">
            <div className="text-xs font-medium text-gray-500">
              <CategoryIcon sx={{ fontSize: 14 }} />
              <span className="ml-1">{category}</span>
            </div>
            <div className="ml-4 text-xs font-medium text-gray-500">
              <KeyboardDoubleArrowUpIcon sx={{ fontSize: 14 }} />
              <span className="ml-1">{questionLevel[level]}</span>
            </div>
            <div className="ml-4 text-xs font-medium text-gray-500">
              <DescriptionIcon sx={{ fontSize: 14 }} />
              <span className="ml-1">{questionType[type]}</span>
            </div>
            <div className="ml-4 text-xs font-medium text-gray-500">
              <AlarmOnIcon sx={{ fontSize: 14 }} />
              <span className="ml-1">{duration}</span>
            </div>
          </div>
        </div>
        {hasDeleted ? (
          <div
            className="cursor-pointer p-4 text-gray-500 hover:text-red-500"
            onClick={() => {
              onDelete(id);
            }}
          >
            <RemoveIcon sx={{ fontSize: 24 }} />
          </div>
        ) : (
          <div
            className="cursor-pointer p-4 text-gray-500 hover:text-primary"
            onClick={() => {
              onAdd(id);
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
          </div>
        )}
      </div>
    </div>
  );
}
