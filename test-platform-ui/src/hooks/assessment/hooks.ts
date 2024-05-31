import { ASSESSMENT_API } from '@/constants/api-endpoints';
import { IAssessment } from '@/constants/assessments';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentById } from './services';

export const useGetAssessmentById = (assessmentId: string) => {
  return useQuery<IAssessment>({
    queryKey: [ASSESSMENT_API.getAssessmentById.api(assessmentId)],
    queryFn: () => getAssessmentById(assessmentId),
  });
};
