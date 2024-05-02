import { CSButton } from '@/components/organisms/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, FormControl } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ILogInValidate } from '../../../constants/assessments';
import { ROUTE_KEY } from '../../../constants/routePaths';
import { Validations } from '../../../validations/validation';
import CustomTextField from '../../atoms/CustomModules/CustomTextField';

const TestValidateAdminEmail = [
  'phuong.bui@saigontechnology.com',
  'dat.ngo@saigontechnology.com',
  'nghia.nguyen@saigontechnology.com',
  'khanh.nguyen@saigontechnology.com',
  'tan.vo@saigontechnology.com',
];

const SignIn = () => {
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
    setError,
  } = form;

  const onSubmitLogIn = (data: ILogInValidate) => {
    const isAdminEmail = TestValidateAdminEmail.includes(data.email);
    if (isAdminEmail) {
      router.push(ROUTE_KEY.ADMINISTRATION);
    } else {
      setError('email', {
        type: 'manual',
        message: 'Email did not exist as an administrator.',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Box component="form" noValidate autoComplete="off" className="w-full">
        <FormControl variant="standard" className="w-full pb-7">
          <CustomTextField
            placeholder="Administrator Email"
            name="email"
            className="mx-2 my-2"
            sx={{
              '& input': { backgroundColor: 'transparent' },
            }}
            onKeyDown={(event: any) => {
              if (event.keyCode === 13) {
                event.preventDefault();
              }
            }}
          />
        </FormControl>
      </Box>
      <CSButton
        label="Login"
        onClick={form.handleSubmit(onSubmitLogIn)}
        isDisabled={!isValid}
      />
    </FormProvider>
  );
};

export default SignIn;
