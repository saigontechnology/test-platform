'use client';
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    subtitle3: React.CSSProperties;
    subtitle4: React.CSSProperties;
    body3: React.CSSProperties;
    caption1: React.CSSProperties;
    caption2: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    subtitle3?: React.CSSProperties;
    subtitle4?: React.CSSProperties;
    body3?: React.CSSProperties;
    caption1?: React.CSSProperties;
    caption2?: React.CSSProperties;
  }

  interface PaletteColor {
    salsify_grass?: string;
    cornflower_blue?: string;
  }
  interface SimplePaletteColorOptions {
    salsify_grass?: string;
    cornflower_blue?: string;
  }

  interface Palette {
    base: {
      [key: string]: string;
    };
  }
  interface PaletteOptions {
    base: {
      [key: string]: string;
    };
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    subtitle3: true;
    subtitle4: true;
    body3: true;
    caption1: true;
    caption2: true;
  }
}

const regular = 400;
const medium = 500;
const bold = 700;

const themeCustom = createTheme({
  palette: {
    primary: {
      main: '#002a37',
      // salsify_grass: '#33b27f',
      cornflower_blue: '#2196f3',
    },
    base: {
      white: '#FFFFFF',
      black: '#1C1C1C',
    },
  },
  components: {
    MuiDataGrid: {
      defaultProps: {
        rowHeight: 70,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.base.black,
          '& input:focus': {
            boxShadow: 'none',
          },
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.base.black,
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          // fontFamily: lusitana.style.fontFamily,
          borderRadius: 12,
          boxShadow: 'none',
          maxHeight: 48,
          fontSize: 13,
          borderColor: theme.palette.primary.cornflower_blue,
          color: theme.palette.base.black,
          textTransform: 'capitalize',
          ...(ownerState.variant === 'contained' && {
            backgroundColor: `${theme.palette.primary.cornflower_blue} !important`,
            color: theme.palette.base.white,
          }),
          '&:hover': {
            borderColor: theme.palette.primary.cornflower_blue,
          },
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
    // // fontFamily: lusitana.style.fontFamily,
    // h1: {
    //   fontSize: '31px',
    //   lineHeight: '31px',
    //   fontWeight: bold,
    // },
    // h2: {
    //   fontSize: '27px',
    //   lineHeight: '29px',
    //   fontWeight: bold,
    // },
    // h3: {
    //   fontSize: '21px',
    //   lineHeight: '23px',
    //   fontWeight: bold,
    // },
    // h4: {
    //   fontSize: '17px',
    //   lineHeight: '19px',
    //   fontWeight: bold,
    // },
    // h5: {
    //   fontSize: '15px',
    //   lineHeight: '17px',
    //   fontWeight: bold,
    // },
    // h6: {
    //   fontSize: '13px',
    //   lineHeight: '15px',
    //   fontWeight: bold,
    // },
    // subtitle1: {
    //   fontSize: '21px',
    //   lineHeight: '23px',
    //   fontWeight: medium,
    // },
    // subtitle2: {
    //   fontSize: '17px',
    //   lineHeight: '19px',
    //   fontWeight: medium,
    // },
    // subtitle3: {
    //   fontSize: '15px',
    //   lineHeight: '17px',
    //   fontWeight: medium,
    // },
    // subtitle4: {
    //   fontSize: '13px',
    //   lineHeight: '15px',
    //   fontWeight: bold,
    // },
    // // body1: {
    // //   fontSize: '18px',
    // //   lineHeight: '26px',
    // //   fontWeight: regular,
    // // },
    // body2: {
    //   fontSize: '16px',
    //   lineHeight: '24px',
    //   fontWeight: regular,
    // },
    // body3: {
    //   fontSize: '14px',
    //   lineHeight: '20px',
    //   fontWeight: regular,
    // },
    // caption1: {
    //   fontSize: '12px',
    //   lineHeight: '18px',
    //   fontWeight: regular,
    // },
    // caption2: {
    //   fontSize: '10px',
    //   lineHeight: '16px',
    //   fontWeight: regular,
    // },
  },
});
export default themeCustom;
