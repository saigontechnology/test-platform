import { yupResolver } from '@hookform/resolvers/yup';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Box, Button, FormControl } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ILogInValidate } from '../constants/assessments';
import { ROUTE_KEY } from '../constants/routePaths';
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
      router.push(ROUTE_KEY.ADMINISTRATION_QUESTIONS);
    } else {
      sessionStorage.setItem('candidateEmail', data.email);
      router.push(ROUTE_KEY.EXAMINATION);
    }
  };

  return (
    <FormProvider {...form}>
      <Box component="form" noValidate autoComplete="off">
        <FormControl variant="standard" className="w-full pb-7">
          <CustomTextField
            placeholder="Company Email"
            name="email"
            className="mx-2 my-2"
            sx={{
              '& input': { backgroundColor: 'transparent', color: '#1ff29e' },
            }}
            onKeyDown={(event: any) => {
              if (event.keyCode === 13) {
                event.preventDefault();
              }
            }}
          />
        </FormControl>
      </Box>

      <Button onClick={form.handleSubmit(onSubmitLogIn)} variant="contained">
        Enter <DoubleArrowIcon className="w-5 md:w-6" />
      </Button>
    </FormProvider>
  );
};

export default Login;
