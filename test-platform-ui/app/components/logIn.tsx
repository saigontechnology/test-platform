import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/base';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Box, FormControl } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ILogInValidate } from '../constants/assessments';
import { Validations } from '../validations/validation';
import CustomTextField from './atoms/CustomTextField';

const TestValidateAdminEmail = [
  'phuong.bui@saigontechnology.com',
  'dat.ngo@saigontechnology.com',
  'nghia.nguyen@saigontechnology.com',
  'khanh.nguyen@saigontechnology.com',
];

const Login = () => {
  const router = useRouter();
  const form = useForm<ILogInValidate>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(Validations),
    mode: 'onBlur',
  });

  const {
    formState: { isValid },
  } = form;

  const onSubmitLogIn = (data: ILogInValidate) => {
    const isAdminEmail = TestValidateAdminEmail.includes(data.email);
    if (isAdminEmail) {
      router.push('/administrator');
    } else {
      sessionStorage.setItem('candidateEmail', data.email);
      router.push('/examination');
    }
  };

  return (
    <FormProvider {...form}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="flex flex-row"
      >
        <FormControl variant="standard" className="!w-4/5 pb-7">
          <CustomTextField
            placeholder="Company Email"
            name="email"
            id="question-title-input"
            className="mx-2 my-2 ring-offset-0"
            onKeyDown={(event: any) => {
              if (event.keyCode === 13) {
                event.preventDefault();
              }
            }}
          />
        </FormControl>
      </Box>
      <Button
        disabled={!isValid}
        onClick={form.handleSubmit(onSubmitLogIn)}
        className={clsx(
          'flex items-center gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium md:text-base',
          {
            'bg-blue-500 text-white transition-colors hover:bg-blue-400':
              isValid,
          },
        )}
      >
        <span>Log in</span> <DoubleArrowIcon className="w-5 md:w-6" />
      </Button>
    </FormProvider>
  );
};

export default Login;
