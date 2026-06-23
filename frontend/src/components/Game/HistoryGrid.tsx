import type { GameEntity } from './GameForm';

export interface GenericAttribute {
  value: string | number | string[];
  status: 'correct' | 'partial' | 'incorrect' | 'higher' | 'lower' | string;
}

export interface GenericGuess {
  entity: GameEntity;
  isWin: boolean;
  attributes: GenericAttribute[];
}

interface HistoryGridProps {
  columns: string[];
  guesses: GenericGuess[];
}

export function HistoryGrid({ columns, guesses }: HistoryGridProps) {
  return (
    <div className="mt-8 overflow-x-auto w-full flex flex-col items-center">
      <div className="flex flex-col gap-2 min-w-[600px]">
        
        {/* En-tête de la grille */}
        <div className="flex gap-1.5 font-bold text-xs text-center justify-center mb-1">
          {columns.map((col, idx) => (
            <div key={idx} className="w-[72px] text-slate-300 uppercase tracking-wider">{col}</div>
          ))}
        </div>

        {/* Lignes de l'historique */}
        {guesses.map((guess, index) => {
          const getBgColor = (status?: string) => {
            if (status === 'correct') return 'bg-emerald-500 border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
            if (status === 'partial') return 'bg-amber-500 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
            return 'bg-red-500 border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
          };

          return (
            <div key={guess.entity.name + index} className="flex gap-1.5 items-center justify-center animate-pop-in">
              
              {/* Image Entité */}
              <div className="champion-avatar-cell w-[72px] flex justify-center" style={{ animationDelay: '0s' }}>
                <img 
                  src={guess.entity.imagePath} 
                  className="w-[72px] h-[72px] rounded-lg object-cover block mx-auto border-2 border-white/10 shadow-lg" 
                  alt={guess.entity.name} 
                />
              </div>

              {/* Attributs Génériques */}
              {guess.attributes.map((attr, attrIdx) => (
                <div 
                  key={attrIdx}
                  className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 text-white font-bold text-[11px] text-center capitalize rounded-lg p-1 transition-all duration-300 ${getBgColor(attr.status)}`}
                  style={{ animationDelay: `${(attrIdx + 1) * 0.15}s` }}
                >
                  {Array.isArray(attr.value) ? attr.value.join(', ') : attr.value}
                  {attr.status === 'higher' && <span className="text-base leading-none mt-1 font-black">↑</span>}
                  {attr.status === 'lower' && <span className="text-base leading-none mt-1 font-black">↓</span>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}