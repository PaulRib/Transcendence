import React, { createContext, useContext, useState } from 'react';

type Universe = 'league' | 'country';

interface GameUniverseContextType {
  universe: Universe;
  setUniverse: (u: Universe) => void;
  toggleUniverse: () => void;
}

const GameUniverseContext = createContext<GameUniverseContextType | undefined>(undefined);

export function GameUniverseProvider({ children }: { children: React.ReactNode }) {
  const [universe, setUniverse] = useState<Universe>('league');

  const toggleUniverse = () => {
    setUniverse(prev => prev === 'league' ? 'country' : 'league');
  };

  return (
    <GameUniverseContext.Provider value={{ universe, setUniverse, toggleUniverse }}>
      {children}
    </GameUniverseContext.Provider>
  );
}

export function useGameUniverse() {
  const context = useContext(GameUniverseContext);
  if (context === undefined) {
    throw new Error('useGameUniverse must be used within a GameUniverseProvider');
  }
  return context;
}
