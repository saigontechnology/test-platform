'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';

interface IExaminationResult {
  isDisabledExit?: boolean;
  examResult: {
    information: any;
    scored: number;
  };
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        size={200}
        color="success"
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          fontSize="30px"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function ExaminationResult({ examResult }: IExaminationResult) {
  const router = useRouter();
  return (
    <Stack className="flex items-center justify-center" padding={10}>
      <CircularProgressWithLabel value={examResult.scored} />
      <Box className="mt-10 flex w-9/12 flex-col items-center justify-center gap-10">
        <Box className="w-[80%] text-center">
          <Typography variant="body2">
            Your examination scored will be send to invigilate. I hope all is
            well with you, and appreciate you participating in our technical
            testing. Don&apos;t hesitate to contact our company via support
            email if you have any concern.
          </Typography>
          <Typography variant="body2">Thanks and best regards.</Typography>
        </Box>
        <Box className="w-full">
          <Button
            className="w-full text-lg"
            variant="contained"
            onClick={() => router.replace('/')}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Stack>
  );
}
