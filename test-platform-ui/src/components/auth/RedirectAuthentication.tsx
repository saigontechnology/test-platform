'use client';

import { COOKIE } from '@/constants/common';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

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
    if (pathname !== '/examination') {
      if (token) {
        if (pathname === '/') {
          router.push('/administration/dashboard');
        }
      } else {
        router.push('/');
      }
    }
  }, []);

  return <>{children}</>;
};

export default RedirectAuthentication;
