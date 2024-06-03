'use client';
import useDebounce from '@/hooks/common/useDebounce';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useState } from 'react';
import QuestionCard from './questionCard';

interface IQuestionDrawerProps {
  assessmentId: number;
  list: number[];
  filters: any;
}

interface IQuestion {
  id: number;
  description: string;
  categories: string[];
  answer: number[];
  options: string[];
  level: string;
  type: string;
  duration: number;
  category: string;
  question: string;
  createdAt?: Date;
}

export default function QuestionDrawer(props: IQuestionDrawerProps) {
  const { assessmentId, list, filters } = props;

  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion>();
  const [totalPages, setTotalPages] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [filterSkill, setFilterSkill] = useState<string[]>([]);
  const [filterLevel, setFilterLevel] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assessmentQuestions, setAssessmentQuestions] = useState<number[]>([]);

  const LIMIT = 10;
  const DELAY = 500;

  useEffect(() => {
    setAssessmentQuestions(list);
  }, []);

  useEffect(() => {
    getQuestionsList();
  }, [currentPage, filterSkill, filterLevel, filterType, searchQuery]);

  const getQuestionsList = async () => {
    const response: any = await ApiHook(Methods.GET, `/admin/questions`, {
      params: {
        page: currentPage,
        limit: LIMIT,
        category: filterSkill.join(',') || undefined,
        level: filterLevel.join(',') || undefined,
        type: filterType.join(',') || undefined,
        search: searchQuery || undefined,
      },
    });
    const { data } = response;
    setQuestionList(data.data);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setStartIndex(data.start);
    setEndIndex(data.end);
  };

  const handleChangePage = (_e: any, page: number) => {
    setCurrentPage(page);
  };

  const handleFilterSkill = (name: string) => {
    if (!filterSkill.includes(name)) {
      setFilterSkill([...filterSkill, name]);
    } else {
      setFilterSkill(filterSkill.filter((item) => item !== name));
    }
  };

  const handleFilterLevel = (name: string) => {
    if (!filterLevel.includes(name)) {
      setFilterLevel([...filterLevel, name]);
    } else {
      setFilterLevel(filterLevel.filter((item) => item !== name));
    }
  };

  const handleFilterType = (name: string) => {
    if (!filterType.includes(name)) {
      setFilterType([...filterType, name]);
    } else {
      setFilterType(filterType.filter((item) => item !== name));
    }
  };

  const handleSelectQuestion = (id: number) => {
    setSelectedQuestion(questionList.find((item: any) => item.id === id));
  };

  const handleSearch = useCallback(
    useDebounce((value: string) => {
      setSearchQuery(value);
    }, DELAY),
    [],
  );

  const handleAddQuestion = async (questionId: number) => {
    await ApiHook(Methods.POST, `admin/assessments/question`, {
      data: {
        assessmentId,
        questionId,
      },
    });

    setAssessmentQuestions([...assessmentQuestions, questionId]);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    await ApiHook(
      Methods.DELETE,
      `admin/assessments/${assessmentId}/question/${questionId}`,
    );
    setAssessmentQuestions(
      assessmentQuestions.filter((item: number) => item !== questionId),
    );
  };

  return (
    <div className="grid grid-cols-4">
      <div className="p-2 pt-0">
        <div className="rounded border border-t-0 border-gray-200">
          <div className="rounded-t bg-gray-100 p-4 text-sm font-medium">
            Category
          </div>
          <FormGroup>
            {filters?.category.map((item: string, index: number) => {
              return (
                <div
                  className="flex items-center justify-between px-2 text-sm"
                  key={index}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item}
                        onChange={() => handleFilterSkill(item)}
                      />
                    }
                    label={<p className="text-sm">{item}</p>}
                  />
                </div>
              );
            })}
          </FormGroup>
        </div>
        <div className="mt-2 rounded border border-t-0 border-gray-200">
          <div className="bg-gray-100 p-4 text-sm font-medium">
            Question Levels
          </div>
          <FormGroup>
            {filters?.level.map((item: string, index: number) => {
              return (
                <div
                  className="flex items-center justify-between px-2 text-sm"
                  key={index}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item}
                        onChange={() => handleFilterLevel(item)}
                      />
                    }
                    label={<p className="text-sm">{item}</p>}
                  />
                </div>
              );
            })}
          </FormGroup>
        </div>
        <div className="mt-2 rounded border border-t-0 border-gray-200">
          <div className="bg-gray-100 p-4 text-sm font-medium">
            Question Types
          </div>
          <FormGroup>
            {filters?.type.map((item: string, index: number) => {
              return (
                <div
                  className="flex items-center justify-between px-2 text-sm"
                  key={index}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item}
                        onChange={() => handleFilterType(item)}
                      />
                    }
                    label={<p className="text-sm">{item}</p>}
                  />
                </div>
              );
            })}
          </FormGroup>
        </div>
      </div>

      <div className="col-span-3 border border-gray-200 text-center">
        <div
          className="flex justify-end border-b border-gray-200
        py-1.5 pr-1"
        >
          <input
            type="text"
            className="w-1/2 rounded border border-gray-200 p-2 text-sm"
            placeholder="Search for question"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 p-2">
          <div className="text-xs">
            Showing
            {total ? (
              <span>
                {startIndex} - {endIndex} of {total} questions
              </span>
            ) : (
              <span> {total} question</span>
            )}
          </div>
          <div className="text-xs ">
            <Pagination
              count={totalPages}
              size="small"
              onChange={handleChangePage}
            />
          </div>
        </div>
        <div className="h-[calc(100vh_-_96px)] overflow-y-scroll pb-4">
          {questionList.length
            ? questionList.map((question: any, index: number) => {
                return (
                  <QuestionCard
                    key={question.id}
                    id={question.id}
                    index={startIndex + index}
                    description={question.description}
                    category={question.category}
                    level={question.level}
                    type={question.type}
                    duration={question.duration}
                    selected={selectedQuestion?.id || 0}
                    onSelect={handleSelectQuestion}
                    hasDeleted={assessmentQuestions.includes(question.id)}
                    onAdd={handleAddQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
