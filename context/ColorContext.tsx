import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Colors } from 'react-native-ui-lib';

export type MacroColors = {
  fat: string;
  protein: string;
  carbs: string;
  kcals: string;
};

type ColorsContextType = {
  get: (macro: keyof MacroColors) => string;
  set: (macro: keyof MacroColors, color: string) => void;
};

type ColorsProviderProps = {
  children: ReactNode;
};

const ColorsContext = createContext<ColorsContextType | null>(null);

export function ColorsProvider({ children }: ColorsProviderProps) {
  const [colors, setColors] = useState({
    fat: Colors.violet50,
    carbs: Colors.violet40,
    protein: Colors.violet30,
    kcals: Colors.violet10,
  });

  const updateColor = (macro: string, color: string) => {
    setColors((prevColors) => ({
      ...prevColors,
      [macro]: color,
    }));
  };

  return (
    <ColorsContext.Provider
      value={{
        get: (key) => colors[key],
        set: updateColor,
      }}>
      {children}
    </ColorsContext.Provider>
  );
}

// Custom hook for easier context usage
export const useColors = () => {
  const context = useContext(ColorsContext);
  if (!context) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};
