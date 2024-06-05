'use client';

import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

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
        {/* <Loader /> */}
      </div>
    );
  }

  return <>{children}</>;
};

export default WithAuthentication;
