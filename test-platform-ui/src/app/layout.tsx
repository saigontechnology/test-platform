import { openSans } from '@/styles/fonts';
import '@/styles/global.css';
import { ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import themeCustom from '../styles/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>Saigon Technology - Test Platform</title>
      <body id="root" className={`${openSans.className} antialiased`}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeCustom}>{children}</ThemeProvider>
          <ToastContainer />
        </StyledEngineProvider>
      </body>
    </html>
  );
}
