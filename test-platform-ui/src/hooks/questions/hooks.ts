import { QUESTION_API } from '@/constants/api-endpoints';
import { useQuery } from '@tanstack/react-query';
import { getFilters, getQuestions } from './services';

export const useGetQuestions = (payload: any) => {
  return useQuery<any>({
    queryKey: [QUESTION_API.getQuestions.api()],
    queryFn: () => getQuestions(payload),
  });
};

export const useGetQuestionFilters = () => {
  return useQuery<any>({
    queryKey: [QUESTION_API.getFilters.api()],
    queryFn: () => getFilters(),
  });
};
