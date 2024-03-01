'use client';

import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { Box, Typography } from '@mui/material';
import Login from './components/logIn';

export default function Home() {
  return (
    <Box className="flex min-h-screen flex-col" bgcolor="#002a37">
      <Box className="mx-auto my-0 flex grow flex-col items-center justify-center">
        <LocalFloristIcon sx={{ fontSize: '90px', color: '#1ff29e' }} />
        <Typography
          color="#1ff29e"
          fontWeight="bold"
          variant="h2"
          className="my-7"
        >
          Welcome to Test Platform
        </Typography>
        <Box
          className="flex flex-col justify-center gap-6 rounded-lg px-6 py-10 "
          bgcolor="#2c4952"
        >
          <Typography variant="h6">Examination Platform</Typography>
          <Typography variant="body2">
            This is the example for the Technical Assessment
          </Typography>
          <Login />
        </Box>
      </Box>
    </Box>
  );
}
