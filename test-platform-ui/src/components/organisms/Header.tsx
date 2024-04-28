'use client';

import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import PlatformBreadCrumbs, { IBreadCrumbs } from '../atoms/BreadCrumbs';

interface IHeader {
  children?: React.ReactNode;
}

const Header: React.FC<IHeader> = ({ children }) => {
  const pathname = usePathname();
  const [breadCrumbs, setBreadCrumbs] = React.useState<IBreadCrumbs[]>();

  const mapBreadCrumbs = (paths: string) => {
    const splitPath = paths
      .split('/')
      .map((path: string, indx: number, paths: string[]) => {
        return {
          name: path.charAt(0).toUpperCase() + path.slice(1),
          href: '/' + paths.slice(0, indx + 1).join('/'),
        };
      })
      .filter(Boolean);
    setBreadCrumbs(splitPath);
  };

  React.useEffect(() => {
    const pathWithoutFirstSlash = pathname.replace(/^\/|\/$/g, '');
    mapBreadCrumbs(pathWithoutFirstSlash);
  }, [pathname]);

  return (
    <Box className="flex h-auto items-center justify-between bg-white p-6 gap-5">
      {breadCrumbs && !children ? (
        <PlatformBreadCrumbs breadcrumbs={breadCrumbs} />
      ) : (
        children
      )}
    </Box>
  );
};

export default Header;
