import React, { createContext, useContext, useState } from 'react';
import type { RetrievalMode } from '../types/risk.types';

interface RetrievalModeContextValue {
  mode: RetrievalMode;
  setMode: (mode: RetrievalMode) => void;
}

const RetrievalModeContext = createContext<RetrievalModeContextValue>({
  mode: 'CONTEXT',
  setMode: () => {},
});

export function RetrievalModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<RetrievalMode>('CONTEXT');

  return (
    <RetrievalModeContext.Provider value={{ mode, setMode }}>
      {children}
    </RetrievalModeContext.Provider>
  );
}

export function useRetrievalModeContext() {
  return useContext(RetrievalModeContext);
}
