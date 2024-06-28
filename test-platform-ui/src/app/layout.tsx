'use client';

import RedirectAuthentication from '@/components/auth/RedirectAuthentication';
import WithAuthentication from '@/components/auth/WithAuthentication';
import { AuthProvider } from '@/libs/contextStore';
import { openSans } from '@/styles/fonts';
import '@/styles/global.css';
import { ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import themeCustom from '../styles/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <title>Saigon Technology</title>
      <body id="root" className={`${openSans.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <RedirectAuthentication>
            <WithAuthentication>
              <AuthProvider>
                <StyledEngineProvider injectFirst>
                  <ThemeProvider theme={themeCustom}>{children}</ThemeProvider>
                  <ToastContainer />
                </StyledEngineProvider>
              </AuthProvider>
            </WithAuthentication>
          </RedirectAuthentication>
        </QueryClientProvider>
      </body>
    </html>
  );
}
