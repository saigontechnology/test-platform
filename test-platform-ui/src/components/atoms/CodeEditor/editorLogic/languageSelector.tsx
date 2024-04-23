import {
  Box,
  Button,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { useState } from 'react';
import { LANGUAGE_VERSIONS } from '../../../../constants/code-question-constants';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const languages = Object.entries(LANGUAGE_VERSIONS);

interface ILangSelector {
  language: string;
  onSelect: (language: string) => void;
}

export default function LanguageSelector({
  language,
  onSelect,
}: ILangSelector) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (lang: string) => {
    onSelect(lang);
    setAnchorEl(null);
  };

  return (
    <Box className="h-fit w-fit pb-4">
      <Button
        id="demo-customized-button"
        className="!rounded-none"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        {language}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {languages.map(([lang, version]) => {
          return (
            <MenuItem
              key={lang}
              onClick={() => handleSelect(lang)}
              disableRipple
            >
              {lang}
              &nbsp;
              <Typography fontSize={12}>{version}</Typography>
            </MenuItem>
          );
        })}
      </StyledMenu>
    </Box>
  );
}
