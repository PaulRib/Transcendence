import { Fragment } from 'react';
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
    <div className="mt-8 overflow-x-auto w-full flex justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div 
        className="grid gap-1.5 sm:gap-2 w-fit px-1 sm:px-2 pb-4"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(75px, 105px))` }}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="text-slate-300 uppercase tracking-wide text-[11px] sm:text-xs font-extrabold leading-tight break-words flex items-center justify-center p-1 text-center min-h-[36px]">
            {col}
          </div>
        ))}

        {guesses.map((guess) => {
          const getBgColor = (status?: string) => {
            if (status === 'correct') return 'bg-emerald-500 border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
            if (status === 'partial') return 'bg-amber-500 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
            return 'bg-red-500 border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
          };

          return (
            <Fragment key={guess.entity.name}>
              <div className="champion-avatar-cell flex items-center justify-center w-full aspect-square" style={{ animationDelay: '0s' }}>
                <img 
                  src={guess.entity.imagePath} 
                  className="w-full h-full rounded-lg object-cover block mx-auto border-2 border-white/10 shadow-lg" 
                  alt={guess.entity.name} 
                />
              </div>

              {guess.attributes.map((attr, attrIdx) => (
                <div
                  key={attrIdx}
                  className={`guess-box flex flex-row flex-wrap items-center justify-center gap-1 w-full aspect-square border-2 text-white font-bold text-xs sm:text-sm leading-tight text-center break-words rounded-lg p-1 sm:p-1.5 transition-all duration-300 ${getBgColor(attr.status)}`}
                  style={{ animationDelay: `${(attrIdx + 1) * 0.4}s` }}
                >
                  <span className="line-clamp-3">
                    {Array.isArray(attr.value) ? attr.value.join(', ') : attr.value}
                  </span>
                  {attr.status === 'higher' && <span className="text-base sm:text-lg font-black">↑</span>}
                  {attr.status === 'lower' && <span className="text-base sm:text-lg font-black">↓</span>}
                </div>
              ))}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
