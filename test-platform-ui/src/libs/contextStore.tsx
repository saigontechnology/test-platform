'use client';

import React, { ReactNode, createContext, useState } from 'react';

/** Data store ========================== */
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

/** Authenticate ========================== */
interface IAuth {
  userRole: string | null;
  userPermissions: string[] | null;
}

interface AuthContextProps {
  authData: IAuth | null;
  updateData: (newData: IAuth) => void;
}

const AuthContext = createContext<AuthContextProps>({
  authData: null,
  updateData: () => null,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authData, setData] = useState<IAuth>({
    userRole: null,
    userPermissions: null,
  });

  const updateData = (newData: IAuth) => setData(newData);

  return (
    <AuthContext.Provider value={{ authData, updateData }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, DataContext, DataProvider };
