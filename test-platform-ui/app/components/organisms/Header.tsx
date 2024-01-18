"use client"

import Box from '@mui/material/Box';
import * as React from 'react';
import PlatformBreadCrumbs, { IBreadCrumbs } from '../atoms/BreadCrumbs';
import { usePathname } from 'next/navigation';

interface IHeader {}

const Header: React.FC<IHeader> = ({}) => {
  const pathname = usePathname();
  const [breadCrumbs, setBreadCrumbs] = React.useState<IBreadCrumbs[]>();

  const mapBreadCrumbs = (paths: string) => {
    const splitPath = paths.split('/')
      .map((path: string, indx: number, paths: string[]) => {
        return {
          name: path.charAt(0).toUpperCase() + path.slice(1),
          href: '/' + paths.slice(0, indx+1).join('/')
        }
      }).filter(Boolean);
    setBreadCrumbs(splitPath);
  }

  React.useEffect(() => {
      const pathWithoutFirstSlash = pathname.replace(/^\/|\/$/g, '');
      mapBreadCrumbs(pathWithoutFirstSlash);
  }, [pathname])

  return (
    <Box className="flex h-[70px] items-center justify-between bg-white p-6">
      { breadCrumbs && <PlatformBreadCrumbs breadcrumbs={breadCrumbs} /> }
    </Box>
  );

};

export default Header;
