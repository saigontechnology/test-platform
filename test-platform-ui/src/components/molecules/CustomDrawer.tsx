'use client';

import React from 'react';

interface ITFDrawer {
  children: React.ReactNode;
  title: string;
  showCloseIcon?: boolean;
  width?: string;
}

export type TFDrawerHandler = {
  open: () => void;
  close: () => void;
};

const TFDrawer = React.forwardRef<TFDrawerHandler, ITFDrawer>(
  ({ children, title, showCloseIcon, width }, ref) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    React.useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    return (
      <div className="relative h-screen w-full">
        <div
          className={`fixed right-0 top-0 z-30 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out`}
          style={{
            width: width || '100%',
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-lg">{title}</p>
            {showCloseIcon ? (
              <button
                className="text-xl font-bold"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            ) : null}
          </div>
          <p className="p-4">{children}</p>
        </div>
      </div>
    );
  },
);

TFDrawer.displayName = 'TFDrawer';

export default TFDrawer;
