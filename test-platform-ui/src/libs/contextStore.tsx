'use client';

import React, { ReactNode, createContext, useState } from 'react';

// Define interface for the context data
interface IData {
  examId: number;
  pagination?: {
    pageNum: number;
  };
}

interface DataContextProps {
  data: IData;
  isNavCollapsed: boolean;
  updateData: (newData: IData) => void;
  toggleNavCollapse: () => void;
}

const DataContext = createContext<DataContextProps>({
  isNavCollapsed: false,
  data: {
    examId: 0,
    pagination: {
      pageNum: 1,
    },
  },
  updateData: () => null,
  toggleNavCollapse: () => null,
});

const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<IData>({
    examId: 0,
    pagination: { pageNum: 1 },
  });
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const updateData = (newData: IData) => setData(newData);
  const toggleNavCollapse = () => setIsNavCollapsed((prev) => !prev);

  return (
    <DataContext.Provider
      value={{ data, updateData, isNavCollapsed, toggleNavCollapse }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
