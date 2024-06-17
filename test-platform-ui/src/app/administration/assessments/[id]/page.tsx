'use client';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { AssessmentLevels } from '@/constants/assessments';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { QuestionLevels, QuestionType } from '@/libs/definitions';
import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import SaveIcon from '@mui/icons-material/Save';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import QuestionCard from '../(components)/questionCard';
import QuestionDrawer from '../(components)/questionDrawer';

interface IAssessment {
  active: boolean;
  assessmentQuestionMapping: IQuestion[];
  createdAt?: Date;
  duration: number;
  id: number;
  level: string;
  name: string;
  questions: number;
  score: number | undefined;
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

interface IOption {
  value: string;
  label: string;
}

export default function AssessmentDetail() {
  const pathname = usePathname().split('/');
  const assessmentId = pathname[pathname.length - 1];

  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<IAssessment>();
  const [filters, setFilters] = useState<any>();
  const [levels, setLevels] = useState<IOption[]>([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState<IQuestion[]>(
    [],
  );
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [isEditLevel, setIsEditLevel] = useState<boolean>(false);

  const assessmentLevel: any = {
    [AssessmentLevels.JUNIOR]: 'Junior',
    [AssessmentLevels.INTERMEDIATE]: 'Intermediate',
    [AssessmentLevels.SENIOR]: 'Senior',
    [AssessmentLevels.PRINCIPAL]: 'Principal',
  };

  const schema = yup.object({
    empCode: yup.string().required(),
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (assessmentId) {
      getAsssessment();
      getFilters();
    }
  }, [assessmentId]);

  const getAsssessment = async () => {
    const response: any = await ApiHook(
      Methods.GET,
      `admin/assessments/${assessmentId}`,
    );
    setAssessment(response.data);
    setAssessmentQuestions(
      response.data.assessmentQuestionMapping.map((item: any) => {
        return {
          ...item.question,
          score: item.score,
        };
      }),
    );
  };

  const getFilters = async () => {
    const response: any = await ApiHook(
      Methods.GET,
      '/admin/questions/filters',
    );
    setFilters(response.data);
    setLevels(
      response.data.level.map((item: string) => {
        return {
          label: assessmentLevel[item],
          value: item,
        };
      }),
    );
  };

  const handleSelectQuestion = (id: number) => {
    setSelectedQuestion(
      assessmentQuestions.find((item: any) => item.id === id),
    );
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleOnClose = () => {
    setIsDrawerOpen(false);
    getAsssessment();
  };

  const handleDelete = async (questionId: number) => {
    await ApiHook(
      Methods.DELETE,
      `admin/assessments/${assessmentId}/question/${questionId}`,
    );
    const _questions = assessmentQuestions.filter(
      (item: IQuestion) => item.id !== questionId,
    );
    setAssessmentQuestions(_questions);
    setSelectedQuestion(_questions.length ? _questions[0] : undefined);
    getAsssessment();
  };

  const handleChange = (e: any, key: string) => {
    setAssessment((prev) => {
      if (prev) {
        return { ...prev, [key]: e.target.value };
      }
      return prev;
    });
  };

  const handleSaveName = () => {
    setIsEditName(false);
    updateAsssessment();
  };

  const handleSaveLevel = () => {
    setIsEditLevel(false);
    updateAsssessment();
  };

  const updateAsssessment = async () => {
    const data: any = {
      name: assessment?.name,
      level: assessment?.level,
    };
    await ApiHook(Methods.PUT, `admin/assessments/${assessmentId}`, { data });
  };

  const onSendInvite = async ({ empCode }: { empCode: string }) => {
    const data: any = {
      email: [empCode + '@saigontechnology.com'],
      assessmentId: parseInt(assessmentId),
    };
    await ApiHook(Methods.POST, `admin/examinations/invite`, {
      data,
    });
    setValue('empCode', '', { shouldValidate: true });
  };

  const handleUpdateScore = async (questionId: number, score: string) => {
    await ApiHook(
      Methods.PUT,
      `admin/assessments/${assessmentId}/question/${questionId}`,
      {
        data: {
          score: parseInt(score),
        },
      },
    );
    getAsssessment();
  };

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

  const levelColor: any = {
    [QuestionLevels.JUNIOR]: 'text-green-500',
    [QuestionLevels.INTERMEDIATE]: 'text-yellow-500',
    [QuestionLevels.SENIOR]: 'text-orange-500',
    [QuestionLevels.PRINCIPAL]: 'text-red-500',
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <div>
                {isEditName ? (
                  <input
                    type="text"
                    className="w-full rounded border border-gray-200 p-2 text-sm"
                    placeholder="Enter name of assessment..."
                    onBlur={handleSaveName}
                    autoFocus
                    onChange={(e) => handleChange(e, 'name')}
                    value={assessment?.name}
                  />
                ) : (
                  <>
                    <span className="mr-2 font-medium">{assessment?.name}</span>
                    <EditIcon
                      sx={{ fontSize: 18 }}
                      onClick={() => setIsEditName(true)}
                      className="cursor-pointer hover:text-primary"
                    />
                  </>
                )}
              </div>
              <button onClick={handleOpenDrawer} className="hover:text-primary">
                <AddIcon sx={{ fontSize: 20 }} />
                <span className="ml-2 text-sm ">Add questions</span>
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm text-gray-400">Level</span>
                {isEditLevel ? (
                  <>
                    <select
                      className="ml-2 inline-block w-1/2 rounded border border-gray-200 p-2 text-sm"
                      onChange={(e) => handleChange(e, 'level')}
                      value={assessment?.level}
                    >
                      {levels.map((item: IOption, index: number) => {
                        return (
                          <option value={item.value} key={index}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <SaveIcon
                      sx={{ fontSize: 18 }}
                      className="ml-2 hover:text-primary"
                      onClick={handleSaveLevel}
                    />
                  </>
                ) : (
                  <>
                    <span
                      className={`mx-2 text-sm ${levelColor[assessment?.level || 0]}`}
                    >
                      {assessmentLevel[assessment?.level || 0]}
                    </span>
                    <EditIcon
                      sx={{ fontSize: 16 }}
                      onClick={() => setIsEditLevel(true)}
                      className="cursor-pointer hover:text-primary"
                    />
                  </>
                )}
              </div>
              <div>
                <span className="text-sm text-gray-400">
                  Number of questions shown
                </span>
                <span className="ml-2 text-sm">
                  {assessmentQuestions?.length}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-400">Score</span>
              <span className="text-sm font-medium">{assessment?.score}</span>
            </div>
          </div>
          <div className="h-[calc(100vh_-_201px)] overflow-y-scroll pt-4">
            <div className="text-sm text-gray-400">Questions</div>
            {assessmentQuestions.length
              ? assessmentQuestions.map((question: any, index: number) => {
                  return (
                    <QuestionCard
                      key={question.id}
                      id={question.id}
                      index={index + 1}
                      description={question.description}
                      category={question.category}
                      level={question.level}
                      type={question.type}
                      duration={question.duration}
                      selected={selectedQuestion?.id || 0}
                      onSelect={handleSelectQuestion}
                      hasDeleted={true}
                      onDelete={handleDelete}
                      showMark={true}
                      questionScore={question.score}
                      onBlur={handleUpdateScore}
                    />
                  );
                })
              : null}
          </div>
        </div>
        <div>
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="pb-4 text-sm">Invitation</div>
            <form
              onSubmit={handleSubmit(onSendInvite)}
              className="flex items-center"
            >
              <input
                type="text"
                className="flex-1 rounded-l border border-r-0 border-gray-200 p-2 text-sm"
                placeholder="Enter emp. code ..."
                {...register('empCode')}
              />
              <button
                type="submit"
                className={`flex justify-end rounded-r border border-transparent bg-primary px-8 py-2 text-sm text-white ${isValid ? 'opacity-100' : 'opacity-70'}`}
              >
                Send
              </button>
            </form>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="border-b border-gray-200 pb-4 text-sm">Preview</div>
            {selectedQuestion ? (
              <div className="h-[calc(100vh_-_289px)] overflow-y-scroll pt-4 ">
                <div className="text-lg">{selectedQuestion?.question}</div>
                <div className="mt-4">
                  <div className="flex">
                    <div className="text-xs font-medium text-gray-500">
                      <CategoryIcon sx={{ fontSize: 14 }} />
                      <span className="ml-1">{selectedQuestion?.category}</span>
                    </div>
                    <div className="ml-4 text-xs font-medium text-gray-500">
                      <KeyboardDoubleArrowUpIcon sx={{ fontSize: 14 }} />
                      <span className="ml-1">
                        {questionLevel[selectedQuestion?.level || '']}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex">
                    <div className="text-xs font-medium text-gray-500">
                      <DescriptionIcon sx={{ fontSize: 14 }} />
                      <span className="ml-1">
                        {questionType[selectedQuestion?.type || '']}
                      </span>
                    </div>
                    <div className="ml-4 text-xs font-medium text-gray-500">
                      <AlarmOnIcon sx={{ fontSize: 14 }} />
                      <span className="ml-1">{selectedQuestion?.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <RichTextArea
                    name={selectedQuestion?.description}
                    data={selectedQuestion?.description}
                    isReadOnly={true}
                  />
                </div>
                <div className="mt-4 border-t border-gray-200 p-4">
                  <div className="text-center text-sm font-medium">Answers</div>
                  <div className="mt-4">
                    <RadioGroup value={selectedQuestion?.answer[0] || 0}>
                      {selectedQuestion?.options?.map((item, index) => {
                        return (
                          <div key={index} className="mt-5">
                            <div className="flex items-center rounded-md border-[1px] border-[#64748b] p-5">
                              <FormControlLabel
                                value={index}
                                control={<Radio disabled />}
                                label=""
                              />
                              <RichTextArea
                                key={index}
                                name={item}
                                data={item}
                                isReadOnly={true}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-sm text-gray-400">
                No selected question
              </div>
            )}
          </div>
        </div>
      </div>
      <Drawer open={isDrawerOpen} anchor="right" onClose={handleOnClose}>
        <div className="w-[75vw]">
          <QuestionDrawer
            assessmentId={parseInt(assessmentId)}
            list={assessmentQuestions.map((question: IQuestion) => question.id)}
            filters={filters}
          />
        </div>
      </Drawer>
    </>
  );
}
