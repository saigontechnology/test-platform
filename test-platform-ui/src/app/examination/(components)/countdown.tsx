/* eslint-disable react/display-name */
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';

// Define the props interface
interface CountdownProps {
  value: number; // initial countdown value in seconds
  onFinish: () => void; // callback function when countdown finishes
}

const Countdown = forwardRef<{ stop: () => void }, CountdownProps>(({ value, onFinish }, ref) => {
  const [timeLeft, setTimeLeft] = useState(value);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    setTimeLeft(value);
  }, [value]);

  useEffect(() => {
    if (timeLeft <= 0 && !isStopped) {
      onFinish();
      return;
    }

    if (isStopped) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, [timeLeft, onFinish, isStopped]);

  useImperativeHandle(ref, () => ({
    stop: () => {
      setIsStopped(true);
      setTimeLeft(0);
    },
  }));

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return minutes > 0
      ? `${minutes} ${minutes > 1 ? 'mins' : 'min'} ${seconds} ${seconds > 1 ? 'seconds' : 'second'}`
      : `${seconds} ${seconds > 1 ? 'seconds' : 'second'}`;
  };

  return (
    <div>
      <span
        className={`text-[16px] ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}
      >
        {isStopped ? 'Time up' : formatTime(timeLeft)}
      </span>
    </div>
  );
});

export default Countdown;
