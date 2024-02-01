'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Header from '../components/organisms/Header';
import CountdownTimer from './(components)/countdownTimer';
import ExaminationInfo from './(components)/examInformation';

const ExaminationPage = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      // Custom logic to handle the refresh
      // Display a confirmation message or perform necessary actions
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Box className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <Box className="w-full flex-none md:w-64" bgcolor="#002a37">
        <Box className="flex w-full items-center justify-center p-9">
          <Typography color="#1ff29e" fontWeight="bold" fontSize="25px">
            Examination
          </Typography>
        </Box>
        <ExaminationInfo
          level={'Junior'}
          categories={['React', 'Javascript']}
        />
      </Box>
      <Box className="flex-grow bg-[#f9f9f9]">
        <Header>
          <CountdownTimer initialSeconds={3000} />
        </Header>
        <Box
          className="m-6 flex-grow rounded-[15px] p-6 md:overflow-y-auto"
          bgcolor="#FFFFFF"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ExaminationPage;
