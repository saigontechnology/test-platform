/* eslint-disable react/display-name */
'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';

interface ICustomModal {
  title?: string;
  children: React.ReactNode;
  customClass?: string;
}
export type CustomModalHandler = {
  open: () => void;
  close: () => void;
};

const CustomModal = React.forwardRef<CustomModalHandler, ICustomModal>(
  ({ title, children }, ref) => {
    const [open, setOpen] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const handleClose = (
      _: object,
      reason: 'escapeKeyDown' | 'backdropClick',
    ) => {
      if (reason === 'backdropClick') return;
      setOpen(false);
    };

    return (
      <Modal
        className="grid justify-items-center"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute top-[30%] min-w-fit bg-white shadow-[24px]">
          {title ? (
            <Box className="flex items-center justify-between">
              <Typography
                p={2}
                id="modal-modal-title"
                variant="h6"
                component="h2"
                fontWeight="bold"
              >
                {title}
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          ) : null}
          <Divider />
          <Box p={2}>{children}</Box>
        </Box>
      </Modal>
    );
  },
);

export default CustomModal;
