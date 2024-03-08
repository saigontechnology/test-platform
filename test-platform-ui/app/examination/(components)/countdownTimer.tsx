/* eslint-disable react/display-name */
'use client';

import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ICountdownTimer {
  isPause?: boolean;
  handleTimeout: () => void;
}

export type CountdownTimerHandler = {
  setTime: (_seconds: number) => void;
  getTime: () => void;
};

const CountdownTimer = React.forwardRef<CountdownTimerHandler, ICountdownTimer>(
  ({ handleTimeout, isPause = false }, ref) => {
    const [seconds, setSeconds] = useState<number>(0);

    React.useImperativeHandle(ref, () => ({
      setTime: (_seconds: number) => {
        const time =
          JSON.parse(sessionStorage.getItem('examination')!)?.timer || _seconds;
        setSeconds(+time);
      },
      getTime: () => {
        return seconds;
      },
    }));

    useEffect(() => {
      // Exit early if countdown is finished
      if (seconds <= 0) {
        return;
      }

      // Set up the timer
      const timer = setInterval(() => {
        if (!isPause) {
          if (seconds === 0) {
            handleTimeout();
            setSeconds(0);
          } else setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);

      // Clean up the timer
      return () => clearInterval(timer);
    }, [seconds, isPause]);

    // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
    const formatTime = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    };

    return (
      <Box className="flex w-full items-center justify-center">
        <Typography variant="h5">{formatTime(seconds)}</Typography>
      </Box>
    );
  },
);

export default CountdownTimer;
