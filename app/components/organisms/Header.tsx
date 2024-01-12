import Box from '@mui/material/Box';
import * as React from 'react';

interface IHeader {}

const Header: React.FC<IHeader> = ({}) => {
  return (
    <Box className="flex h-[70px] items-center justify-between bg-white p-6"></Box>
  );
};

export default Header;
