import { inter } from '@/app/styles/fonts';
import '@/app/styles/global.css';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import themeCustom from './styles/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider theme={themeCustom}>{children}</ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
