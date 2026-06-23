import { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { ChampionName } from '../../api/type.api';

interface GameFormProps {
  inputValue: string;
  hasWon: boolean;
  isInputValid: boolean;
  suggestions: ChampionName[];
  onInputChange: (text: string) => void;
  onSelectChampion: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function GameForm({
  inputValue,
  hasWon,
  isInputValid,
  suggestions,
  onInputChange,
  onSelectChampion,
  onSubmit
}: GameFormProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Entrez un nom de champion..." 
          value={inputValue}
          disabled={hasWon}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full m-0 !mb-0 !mt-0"
        />
        <ul className={`absolute top-full m-0 p-0 inset-x-0 z-[100] max-h-[200px] overflow-y-auto list-none bg-[#1d1d20] border border-white/10 rounded-b-lg shadow-lg transition-all duration-200 origin-top ${suggestions.length > 0 ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
          {suggestions.map((champion) => {
            const imageFilename = champion.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return (
              <li
                key={champion.name}
                onClick={() => onSelectChampion(champion.name)}
                className="flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 hover:bg-white/10 text-white transition-colors duration-150"
              >
                <img 
                  src={`/champions/${imageFilename}.png`} 
                  alt={champion.name}
                  className="h-8 w-8 object-cover rounded-sm"
                />
                <span className="font-medium">{champion.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <Button disabled={!isInputValid}>
        Valider
      </Button>
    </form>
  );
}