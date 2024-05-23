'use client';

import { useEffect, useState, ReactNode } from 'react';
import CircularProgress from '@mui/material/CircularProgress'; // Import loading spinner component
import { useRouter } from 'next/navigation';

interface WithAuthenticationProps {
  children: ReactNode;
}

const WithAuthentication: React.FC<WithAuthenticationProps> = ({
  children,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  return <>{children}</>;
};

export default WithAuthentication;
