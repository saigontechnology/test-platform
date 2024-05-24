'use client';

import { useSignIn } from '@/hooks/auth/hooks';
import { ISignInPayload } from '@/hooks/auth/types';
import useEnterKey from '@/hooks/common/useEnterKey';
import { encrypt } from '@/utils/securities';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ISignInForm {
  email: string;
  password: string;
  rememberMe?: boolean | any;
  errorMessage?: string;
}

function Home() {
  const { mutate, isPending } = useSignIn();
  const navigate = useRouter();
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<ISignInForm>();

  useEffect(() => {
    setValue('errorMessage', '');
  }, [watch('email'), watch('password')]);

  const onSubmit = (data: ISignInPayload) => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const passwordEncrypt = encrypt(data?.password, secretKey!);
    mutate(
      { ...data, password: passwordEncrypt },
      {
        onSuccess: () => {
          navigate.push('/administration/dashboard');
        },
        onError: (error: any) => {
          setValue('errorMessage', error.data.message);
        },
      },
    );
  };

  useEnterKey(handleSubmit(onSubmit));

  return (
    <div className="flex h-screen items-center justify-center pb-[200px]">
      <div className="mt-7 w-[350px] rounded-xl border border-gray-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
        <div className="p-4 sm:p-7">
          <div className="flex items-center justify-center">
            <Image
              src="https://saigontechnology.com/themes/sts/images/logo-black.svg"
              width={200}
              height={200}
              alt="Picture of the author"
            />
          </div>
          <div className="mt-20">
            <div className="grid gap-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm dark:text-white"
                >
                  Email address
                </label>
                <div className="relative">
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Email is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="email"
                        className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm disabled:opacity-50 selection:disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        aria-describedby="email-error"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-600" id="email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm dark:text-white"
                  >
                    Password
                  </label>
                  <a className="cursor-pointer text-sm font-medium text-primary decoration-2">
                    Forgot password?
                  </a>
                </div>
                <div className="relative mt-2">
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Password is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="password"
                        className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        aria-describedby="password-error"
                      />
                    )}
                  />
                  {errors.password && (
                    <p
                      className="mt-2 text-xs text-red-600"
                      id="password-error"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex">
                  <Controller
                    name="rememberMe"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="remember-me"
                        type="checkbox"
                        className="mt-0.5 shrink-0 cursor-pointer rounded border-gray-200 text-primary focus:text-primary dark:border-neutral-700 dark:bg-neutral-800 dark:checked:text-primary dark:focus:ring-offset-gray-800"
                      />
                    )}
                  />
                </div>
                <div className="ms-3">
                  <label
                    htmlFor="remember-me"
                    className="text-sm dark:text-white"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              {getValues('errorMessage') && (
                <p className="mt-2 text-xs text-red-600" id="password-error">
                  {getValues('errorMessage')}
                </p>
              )}

              <button
                type="submit"
                className="mt-10 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-primary px-4 py-3 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
                disabled={isPending}
                onClick={handleSubmit(onSubmit)}
              >
                {isPending ? (
                  <CircularProgress className="text-white" size={20} />
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
