'use client';

import NavLinks from '@/components/atoms/NavLinks';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box } from '@mui/material';
import Link from 'next/link';

export default function SideNav() {
  return (
    <Box className="flex h-full flex-col px-3 py-4 md:px-2">
      <Box className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <Box className="h-auto w-full grow rounded-md bg-gray-50 md:block"></Box>
        <Box component="form">
          <Link
            href="/"
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LogoutIcon className="w-6" />
            <div className="md:block">Sign Out</div>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
