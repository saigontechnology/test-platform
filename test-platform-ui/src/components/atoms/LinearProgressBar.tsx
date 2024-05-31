import { Box, LinearProgress, Typography } from '@mui/material';

interface ILinearProgressBar {
  value: number;
  status: string;
}

export default function LinearProgressBar(props: ILinearProgressBar) {
  const progressBarColor =
    props.status === 'Processing'
      ? 'inherit'
      : props.value < 40
        ? 'error'
        : props.value < 65
          ? 'warning'
          : 'success';
  return (
    <Box display="flex" alignItems="center" p={3}>
      <Box width="150px" mr={3}>
        <LinearProgress
          variant="determinate"
          {...props}
          color={progressBarColor}
        />
      </Box>
      <Box minWidth={35}>
        <Typography
          variant="body2"
          color="textSecondary"
          className="text-[12px]"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
