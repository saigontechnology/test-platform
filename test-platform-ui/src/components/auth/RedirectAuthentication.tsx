'use client';

import { useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { COOKIE } from '@/constants/common';
import { usePathname, useRouter } from 'next/navigation';

interface RedirectAuthenticationProps {
  children: ReactNode;
}

const RedirectAuthentication: React.FC<RedirectAuthenticationProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get(COOKIE.TOKEN);
    if (token) {
      if (pathname === '/') {
        router.push('/administration/dashboard');
      }
    } else {
      router.push('/');
    }
  }, []);

  return <>{children}</>;
};

export default RedirectAuthentication;
