import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextProps {
  contractor: string;
  vat: string;
  from: string;
  to: string;
  status: string;
  setContractor: (value: string) => void;
  setVat: (value: string) => void;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  setStatus: (value: string) => void;
}

interface FilterProviderProps {
  children: ReactNode;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [contractor, setContractor] = useState<string>('All contractors');
  const [vat, setVat] = useState<string>('VAT');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [status, setStatus] = useState<string>('All');

  return (
    <FilterContext.Provider
      value={{
        contractor,
        vat,
        from,
        to,
        status,
        setContractor,
        setVat,
        setFrom,
        setTo,
        setStatus,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = (): FilterContextProps => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
