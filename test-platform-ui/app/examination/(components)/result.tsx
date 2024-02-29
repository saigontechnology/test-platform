'use client';

import { Box, Button, Paper, Stack, styled } from '@mui/material';
import { useRouter } from 'next/navigation';

interface IExaminationResult {
  isDisabledExit?: boolean;
  examResult: {
    information: any;
    scored: number;
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ExaminationResult({ examResult }: IExaminationResult) {
  const router = useRouter();
  return (
    <Stack className="justify-between" direction="row" padding={10}>
      <Box className="flex h-64 w-64 items-center justify-center rounded-full border-4 border-lime-500 text-center text-7xl">
        {examResult.scored}%
      </Box>
      <Box className="grid w-9/12 gap-10">
        <Item className="w-full whitespace-pre-wrap px-10 text-xl">
          {`Your examination scored will be send to invigilate. I hope all is well with you, and appreciate you participating in our technical testing. Don't hesitate to contact our company via support email if you have any concern. \n\n Thanks and best regards, ${sessionStorage.getItem(
            'candidateEmail',
          )}.`}
        </Item>
        <Button
          className="text-lg"
          variant="contained"
          onClick={() => router.replace('/')}
        >
          Exit examination
        </Button>
      </Box>
    </Stack>
  );
}
