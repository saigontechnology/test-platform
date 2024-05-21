import { EXAMINATION_API } from '@/constants/api-endpoints';
import { IExamination } from '@/constants/assessments';
import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  getExamination,
  submitExamination,
  updateExaminationExpired,
} from './services';
import { ISubmitExamPayload } from './types';

export const useGetExamination = (examId: string) => {
  return useQuery<IExamination>({
    queryKey: [EXAMINATION_API.getExaminationInfo.api(examId)],
    queryFn: () => getExamination(examId),
    enabled: !!examId,
  });
};

export const useSubmitExamination = () => {
  const mutationOptions: UseMutationOptions<
    void,
    Error,
    ISubmitExamPayload,
    unknown
  > = {
    mutationFn: (payload: ISubmitExamPayload) =>
      submitExamination(payload.examId, payload),
  };
  return useMutation(mutationOptions);
};

export const useUpdateExaminationExpired = () => {
  const mutationOptions: UseMutationOptions<
    void,
    Error,
    { examId: string },
    unknown
  > = {
    mutationFn: (payload: { examId: string }) =>
      updateExaminationExpired(payload.examId),
  };
  return useMutation(mutationOptions);
};
