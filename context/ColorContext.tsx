import React, { createContext, useContext, useState, ReactNode } from "react";
import { Colors } from "react-native-ui-lib";

type ColorsContextType = {
  get: () => {
    fat: string;
    protein: string;
    carbohydrates: string;
    calories: string;
  };
  set: (macro: string, color: string) => void;
};

type ColorsProviderProps = {
  children: ReactNode;
};

const ColorsContext = createContext<ColorsContextType | null>(null);

export function ColorsProvider({ children }: ColorsProviderProps) {
  const [colors, setColors] = useState({
    fat: Colors.green40,
    protein: Colors.red40,
    carbohydrates: Colors.blue40,
    calories: Colors.orange40,
  });

  const updateColor = (macro: string, color: string) => {
    setColors((prevColors) => ({
      ...prevColors,
      [macro]: color,
    }));
  };

  return (
    <ColorsContext.Provider value={{ get: () => colors, set: updateColor }}>
      {children}
    </ColorsContext.Provider>
  );
}

// Custom hook for easier context usage
export const useColors = () => {
  const context = useContext(ColorsContext);
  if (!context) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return context;
};
