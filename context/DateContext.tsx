import React, { createContext, useContext, useState, ReactNode } from "react";

type DateContextType = {
  get: () => Date;
  set: (newDate: Date) => void;
};

type DateProviderProps = {
  children: ReactNode;
};

const DateContext = createContext<DateContextType | null>(null);

export function DateProvider({ children }: DateProviderProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const updateDate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <DateContext.Provider value={{ get: () => currentDate, set: updateDate }}>
      {children}
    </DateContext.Provider>
  );
}

// Custom hook for easier context usage
export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
