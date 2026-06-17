import * as React from "react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { ChampionName } from "../api/type.api";

// --- 1. FORMULAIRE DE RECHERCHE ---
interface SearchChampionFormProps {
  championNames: ChampionName[];
  disabled: boolean;
  guessedNames: string[];
  onSubmitGuess: (championName: string) => void;
}

export function SearchChampionForm({ championNames, disabled, guessedNames, onSubmitGuess }: SearchChampionFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (text.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = championNames.filter((champion) => {
      const matchesText = champion.name.toLowerCase().startsWith(text.toLowerCase());
      const isNotAlreadyGuessed = !guessedNames.includes(champion.name.toLowerCase());
      return matchesText && isNotAlreadyGuessed;
    });
    setSuggestions(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validChamp = championNames.find(c => c.name.toLowerCase() === inputValue.toLowerCase());
    if (validChamp && !guessedNames.includes(validChamp.name.toLowerCase())) {
      onSubmitGuess(validChamp.name);
      setInputValue("");
      setSuggestions([]);
    }
  };

  const isInputValid = championNames.some(c => c.name.toLowerCase() === inputValue.trim().toLowerCase());

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Entrez un nom de champion..."
          value={inputValue}
          disabled={disabled}
          onChange={(e) => handleInputChange(e.target.value)}
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
                  onClick={() => {
                    setInputValue(champion.name);
                    setSuggestions([]);
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground border-b border-[rgb(48,48,48)] transition-colors duration-150"
                >
                  <img src={`/champions/${imageFilename}.png`} alt={champion.name} className="h-8 w-8 border-border object-cover" />
                  <span>{champion.name}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Button type="submit" disabled={!isInputValid || disabled}>
        Valider
      </Button>
    </form>
  );
}

// --- 2. EN-TÊTE DE L'HISTORIQUE ---
export function GuessTableHeader() {
  return (
    <div className="flex gap-2 font-bold text-sm text-center">
      <div className="w-[80px]">Champion</div>
      <div className="w-[80px]">Genre</div>
      <div className="w-[80px]">Position</div>
      <div className="w-[80px]">Espèce</div>
      <div className="w-[80px]">Ressource</div>
      <div className="w-[80px]">Portée</div>
      <div className="w-[80px]">Région</div>
      <div className="w-[80px]">Année</div>
    </div>
  );
}

// --- 3. CARTE DE VICTOIRE ---
interface VictoryCardProps {
  attempts: number;
  onReplay: () => void;
}

export function VictoryCard({ attempts, onReplay }: VictoryCardProps) {
  return (
    <div className="bg-[#28a745]/20 border-[3px] border-[#28a745] rounded-lg p-5 text-center mb-5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-4">
      <h2 className="text-[#28a745] m-0 text-2xl font-bold">🎉 Victoire ! 🎉</h2>
      <p className="m-0">Félicitations, tu as trouvé le champion du jour en {attempts} essais !</p>
      <Button variant="success" onClick={onReplay} className="mt-2 bg-[#28a745] text-white uppercase font-bold border-2 border-black rounded shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all hover:bg-green-600">
        Rejouer
      </Button>
    </div>
  );
}