'use client';

import loginAnimation from '@/lotties/animation-doing-test.json';
import { Box, Typography } from '@mui/material';
import Lottie from 'react-lottie';
import Login from '../components/signin/(components)/SignIn';

export default function Home() {

  const lottieDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  
  return (
    <Box className="min-h-screen">
      <Lottie
        style={{position: 'absolute', zIndex: '1', height: '100%', width: 'auto'}}
	      options={lottieDefaultOptions}
      />
      <Box className="flex grow flex-col items-center justify-center z-50 relative m-[10%] !float-right w-fit">
        <Typography
          color="#2196f3bd"
          fontWeight="normal"
          variant="h2"
          className="my-7"
          style={{textShadow: '3px 3px 5px #f3ebeb'}}
        >
          Welcome to <b>Technical Exam</b>
        </Typography>
        <Box
          className="flex flex-col justify-center items-center gap-6 rounded-lg px-6 py-10 shadow-md w-[450px]"
          bgcolor="#ffffff"
        >
          <Login />
        </Box>
      </Box>
    </Box>
  );
}
