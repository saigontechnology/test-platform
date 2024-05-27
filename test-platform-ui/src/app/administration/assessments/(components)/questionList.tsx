'use client';
import { IQuestion } from '@/constants/assessments';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { useState } from 'react';
import QuestionCard from './questionCard';

export default function QuestionList(props) {
  const { list } = props;
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion>();

  const skills = [
    {
      name: 'React',
      logo: '',
      total: 15,
    },
    {
      name: 'Javascript',
      logo: '',
      total: 18,
    },
    {
      name: 'HTML',
      logo: '',
      total: 12,
    },
    {
      name: 'CSS',
      logo: '',
      total: 13,
    },
  ];

  const levels = [
    {
      name: 'Junior',
      total: 38,
    },
    {
      name: 'Intermediate',
      logo: '',
      total: 49,
    },
    {
      name: 'Senior',
      logo: '',
      total: 25,
    },
  ];

  const types = [
    {
      name: 'Single Choice',
      total: 38,
    },
    {
      name: 'Multi Choice',
      total: 49,
    },
  ];

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestion(list[index]);
  };

  return (
    <div className="grid grid-cols-4">
      <div className="p-2 pt-0">
        <div className="rounded border border-t-0 border-gray-200">
          <div className="rounded-t bg-gray-100 p-4 text-sm font-medium">
            Skills
          </div>
          <FormGroup>
            {skills.map((skill) => {
              return (
                <div className="flex items-center justify-between px-2 text-sm">
                  <FormControlLabel
                    control={<Checkbox value={skill.name} />}
                    label={<p className="text-sm">{skill.name}</p>}
                  />
                  <span className="text-sm text-gray-400">{skill.total}</span>
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
            {levels.map((level) => {
              return (
                <div className="flex items-center justify-between px-2 text-sm">
                  <FormControlLabel
                    control={<Checkbox value={level.name} />}
                    label={<p className="text-sm">{level.name}</p>}
                  />
                  <span className="text-sm text-gray-400">{level.total}</span>
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
            {types.map((type) => {
              return (
                <div className="flex items-center justify-between px-2 text-sm">
                  <FormControlLabel
                    control={<Checkbox value={type.name} />}
                    label={<p className="text-sm">{type.name}</p>}
                  />
                  <span className="text-sm text-gray-400">{type.total}</span>
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
          />
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 p-2">
          <div className="text-xs">Showing 1 - 10 of 97 questions</div>
          <div className="text-xs ">pagination</div>
        </div>
        <div className="h-[calc(100vh_-_86px)] overflow-y-scroll pb-4">
          {list.map((question: IQuestion, index: number) => {
            return (
              <QuestionCard
                id={question.id}
                index={index}
                content={question.content}
                category={question.category}
                level={question.level}
                type={question.type}
                duration={question.duration}
                selected={selectedQuestion?.id}
                onSelect={handleSelectQuestion}
                hasDeleted={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
