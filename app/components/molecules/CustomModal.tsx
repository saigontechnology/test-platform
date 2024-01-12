/* eslint-disable react/display-name */
import Box from '@mui/material/Box';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';

interface ICustomModal {
  title: string;
  children: React.ReactNode;
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

    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute left-[30%] top-[30%] min-w-[700px] bg-white shadow-[24px]">
          <Typography
            p={2}
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontWeight="bold"
          >
            {title}
          </Typography>
          <Divider />
          <Box p={2}>{children}</Box>
        </Box>
      </Modal>
    );
  },
);

export default CustomModal;
