'use client';

import DashboardCard from '@/app/administration/dashboard/(components)/dashboardCard';
import { IAssessment } from '@/constants/assessments';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { useEffect, useState } from 'react';

export default function DashboardGrid() {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);

  const getAssessement = async () => {
    const response: any = await ApiHook(Methods.GET, '/assessments');
    setAssessments(response.data);
  };

  useEffect(() => {
    getAssessement();
  }, []);

  return (
    <div className="col-span-2 grid grid-cols-1 gap-4 rounded md:grid-cols-2 lg:grid-cols-3">
      {assessments.map((assessment) => {
        return (
          <DashboardCard
            name={assessment.name}
            level={assessment.level}
            questions={assessment.assessmentQuestionMapping.length}
            duration="25 mins"
            status="active"
            id={assessment.id}
            key={assessment.id}
          />
        );
      })}
    </div>
  );
}
