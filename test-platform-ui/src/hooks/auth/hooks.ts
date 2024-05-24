import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { signIn } from './services';
import { ISignInPayload } from './types';

export const useSignIn = () => {
  const mutationOptions: UseMutationOptions<
    void,
    Error,
    ISignInPayload,
    unknown
  > = {
    mutationFn: (payload: ISignInPayload) => signIn(payload),
  };
  return useMutation(mutationOptions);
};
