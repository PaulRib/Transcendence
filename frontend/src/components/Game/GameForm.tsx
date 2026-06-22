import { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { ChampionName } from '../../api/type.api';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={t("game.inputPlaceholder")}
          value={inputValue}
          disabled={hasWon}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full"
        />
        {isFocused && suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 inset-x-0 z-10 max-h-[200px] overflow-y-auto m-0 p-0 list-none bg-[rgb(8,18,40)] border border-[rgb(48,48,48)] rounded-lg">
            {suggestions.map((champion) => {
              const imageFilename = champion.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              return (
                <li
                  key={champion.name}
                  onClick={() => onSelectChampion(champion.name)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
                >
                  <img 
                    src={`/champions/${imageFilename}.png`} 
                    alt={champion.name}
                    className="h-8 w-8 border-border object-cover"
                  />
                  <span>{champion.name}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Button type="submit" disabled={!isInputValid} className="rounded-lg">
        {t("game.submit")}
      </Button>
    </form>
  );
}