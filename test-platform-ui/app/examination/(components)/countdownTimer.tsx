'use client';

import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ICountdownTimer {
  initialSeconds: number;
}

const CountdownTimer: React.FC<ICountdownTimer> = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    // Exit early if countdown is finished
    if (seconds <= 0) {
      return;
    }

    // Set up the timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Clean up the timer
    return () => clearInterval(timer);
  }, [seconds]);

  // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Box className="flex items-center gap-10">
      <Typography variant="h6">Countdown</Typography>
      <Typography variant="h5">{formatTime(seconds)}</Typography>
    </Box>
  );
};

export default CountdownTimer;
