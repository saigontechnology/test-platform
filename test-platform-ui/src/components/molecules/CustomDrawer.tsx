import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton } from '@mui/material';
import React from 'react';

interface ICustomDrawer {
  children: React.ReactNode;
}

export type CustomDrawerHandler = {
  open: () => void;
  close: () => void;
};

const CustomDrawer = React.forwardRef<CustomDrawerHandler, ICustomDrawer>(
  ({ children }, ref) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    React.useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    const toggleDrawer =
      (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        setIsOpen(open);
      };

    return (
      <Drawer anchor={'right'} open={isOpen} onClose={toggleDrawer(false)}>
        <IconButton onClick={() => toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
        {children}
      </Drawer>
    );
  },
);

export default CustomDrawer;
