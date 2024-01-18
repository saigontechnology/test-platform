import '@/app/styles/global.css';
import { inter } from '@/app/styles/fonts';
import { ThemeProvider } from '@mui/material';
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
      </body>
    </html>
  );
}
