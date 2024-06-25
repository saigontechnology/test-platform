'use client';

import NavLinks, { SideNavHandler } from '@/components/atoms/NavLinks';
import { DataProvider } from '@/libs/contextStore';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { useRef } from 'react';
import Image from '../../../node_modules/next/image';
import Header from '../../components/organisms/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navRef = useRef<SideNavHandler | null>(null);
  return (
    <DataProvider>
      <Box className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        {/* Nav container */}
        <Box
          className="flex-none transition-[width] ease-in-out md:w-60"
          bgcolor="#2D2E3E"
          sx={{
            '&:has(div.collapsed)': {
              width: '4rem !important',

              '& > button.collapse-button > svg': {
                transform: 'rotate(0deg)',
              },

              '& > img.company-logo': {
                height: '70px',
                padding: '1rem 1rem !important',
                transition: 'height 0.3s ease-out',
                content:
                  'url("https://appraisal.saigontechnology.vn/assets/img/icon/general.svg") ',
              },
            },
          }}
        >
          <IconButton
            disableRipple
            className="collapse-button float-right px-2 text-white"
            onClick={() => navRef.current?.toggleCollapse()}
            type="button"
          >
            <KeyboardTabIcon
              sx={{
                transform: 'rotate(180deg)',
              }}
            />
          </IconButton>
          <Image
            className="company-logo p-9 pt-5"
            src="/logo.svg"
            width={500}
            height={500}
            alt="Picture of the author"
          />
          <NavLinks ref={navRef} />
        </Box>
        {/* Page content */}
        <Box className="flex-grow bg-[#f9f9f9]">
          <Header />
          <Box className="m-6 h-[calc(100vh_-_128px)] flex-grow rounded-[15px] md:overflow-hidden">
            {children}
          </Box>
        </Box>
      </Box>
    </DataProvider>
  );
};

export default Layout;
