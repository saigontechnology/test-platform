import NavLinks from '@/components/atoms/NavLinks';
import { DataProvider } from '@/libs/contextStore';
import Box from '@mui/material/Box';
import Image from '../../../node_modules/next/image';
import Header from '../../components/organisms/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <Box className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <Box className="w-full flex-none md:w-60" bgcolor="#2D2E3E">
          <Box className="flex w-full flex-col items-center justify-center p-9">
            <Image
              src="/logo.svg"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </Box>
          <NavLinks />
        </Box>
        <Box className="flex-grow bg-[#f9f9f9]">
          <Header />
          <Box className="flex-grow rounded-[15px] p-6 md:overflow-y-auto">
            {children}
          </Box>
        </Box>
      </Box>
    </DataProvider>
  );
}
