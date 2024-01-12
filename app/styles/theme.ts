'use client';
import { createTheme } from '@mui/material/styles';
import { lusitana } from '@/app/styles/fonts';

const themeCustom = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          // fontFamily: lusitana.className,
          borderRadius: 12,
          boxShadow: 'none',
          color: '#FFFFFF',
          maxHeight: 48,
          fontSize: 16,
          backgroundColor: '#1565c0 !important',
          textTransform: 'capitalize',
        }),
        sizeLarge: {
          padding: '12px 40px',
        },
        sizeMedium: {
          padding: '8px 32px',
        },
        sizeSmall: {
          padding: '5px 24px',
          fontSize: 14,
        },
      },
    },
  },
  typography: {
    // fontFamily: lusitana.className,
  },
});
export default themeCustom;
