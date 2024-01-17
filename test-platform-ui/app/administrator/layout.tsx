import SideNav from '@/app/components/atoms/NavLinks';
import Box from '@mui/material/Box';
import Header from '../components/organisms/Header';
import Typography from '@mui/material/Typography';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <Box className="w-full flex-none md:w-64" bgcolor="#002a37">
        <Box className="flex w-full items-center justify-center p-9">
          <Typography color="#1ff29e" fontWeight="bold" fontSize="25px">
            Test Platform
          </Typography>
        </Box>
        <SideNav />
      </Box>
      <Box className="flex-grow bg-[#f9f9f9]">
        <Header />
        <Box
          className="m-6 flex-grow rounded-[15px] p-6 md:overflow-y-auto"
          bgcolor="#FFFFFF"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
