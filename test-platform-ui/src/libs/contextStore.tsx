'use client';

import React, { createContext, useState } from 'react';

// Define interface for the context data
interface IData {
  examId: number;
  pagination?: {
    pageNum: number;
  };
}
interface DataContextProps {
  data: IData;
  updateData: (newData: IData) => void;
}

const DataContext = createContext<DataContextProps>({
  data: {
    examId: 0,
    pagination: {
      pageNum: 1,
    },
  },
  updateData: () => null,
});

const DataProvider: React.FC<any> = ({ children }: any) => {
  const [data, setData] = useState<IData>({ examId: 0 });

  const updateData = (newData: IData) => setData(newData);

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
