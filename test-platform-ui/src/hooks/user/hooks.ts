import { USER_API } from '@/constants/api-endpoints';
import { useQuery } from '@tanstack/react-query';
import { getCandidates } from './services';
import { ICandidate } from './types';

export const useGetCandidates = () => {
  return useQuery<ICandidate[]>({
    queryKey: [USER_API.getCandidates.api],
    queryFn: () => getCandidates(),
  });
};
