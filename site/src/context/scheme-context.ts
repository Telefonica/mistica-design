import { createContext } from 'react';

type SchemeContextValue = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const SchemeContext = createContext<SchemeContextValue | undefined>(undefined);
