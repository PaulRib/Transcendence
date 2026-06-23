import { Input } from "../ui/input";
import { Button } from "../ui/button";
export interface GameEntity {
  name: string;
  imagePath: string;
}

interface GameFormProps {
  inputValue: string;
  hasWon: boolean;
  isInputValid: boolean;
  suggestions: GameEntity[];
  placeholder?: string;
  onInputChange: (text: string) => void;
  onSelectEntity: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function GameForm({
  inputValue,
  hasWon,
  isInputValid,
  suggestions,
  placeholder = "Entrez un nom...",
  onInputChange,
  onSelectEntity,
  onSubmit
}: GameFormProps) {

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder} 
          value={inputValue}
          disabled={hasWon}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full m-0 !mb-0 !mt-0"
        />
        <ul className={`absolute top-full m-0 p-0 inset-x-0 z-[100] max-h-[200px] overflow-y-auto list-none bg-[#1d1d20] border border-white/10 rounded-b-lg shadow-lg transition-all duration-200 origin-top ${suggestions.length > 0 ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
          {suggestions.map((entity) => (
            <li
              key={entity.name}
              onClick={() => onSelectEntity(entity.name)}
              className="flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 hover:bg-white/10 text-white transition-colors duration-150"
            >
              <img 
                src={entity.imagePath} 
                alt={entity.name}
                className="h-8 w-8 object-cover rounded-sm"
              />
              <span className="font-medium">{entity.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button disabled={!isInputValid}>
        Valider
      </Button>
    </form>
  );
}