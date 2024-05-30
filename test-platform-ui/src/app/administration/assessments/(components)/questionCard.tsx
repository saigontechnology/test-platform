'use client';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { QuestionLevels, QuestionType } from '@/libs/definitions';
import AddIcon from '@mui/icons-material/Add';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export default function QuestionCard(props) {
  const {
    id,
    index,
    selected,
    onSelect,
    content,
    category,
    level,
    type,
    duration,
    hasDeleted = true,
    onAdd,
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
    <div className="mt-4 flex items-center pr-4">
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
            name={content}
            data={content}
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
          <div className="cursor-pointer p-4 text-gray-500 hover:text-red-500">
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
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
