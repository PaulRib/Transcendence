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
    <div className="mt-8 w-full flex justify-center overflow-x-hidden">
      <div 
        className="grid gap-1 sm:gap-1.5 md:gap-2 w-full max-w-6xl mx-auto px-1 sm:px-2 pb-4"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((col, idx) => (
          <div 
            key={idx} 
            className="min-w-0 overflow-hidden text-slate-300 uppercase tracking-tighter sm:tracking-tight md:tracking-wide text-[clamp(6px,1.15vw,13px)] font-extrabold leading-tight flex items-center justify-center px-0.5 py-1 text-center min-h-[28px] sm:min-h-[36px] select-none"
          >
            <span className="w-full whitespace-nowrap">{col}</span>
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
              <div className="champion-avatar-cell min-w-0 overflow-hidden flex items-center justify-center w-full aspect-square" style={{ animationDelay: '0s' }}>
                <img 
                  src={guess.entity.imagePath} 
                  className="w-full h-full rounded sm:rounded-lg object-cover block mx-auto border sm:border-2 border-white/10 shadow-lg" 
                  alt={guess.entity.name} 
                />
              </div>

              {guess.attributes.map((attr, attrIdx) => (
                <div
                  key={attrIdx}
                  className={`guess-box min-w-0 overflow-hidden flex flex-row flex-wrap items-center justify-center gap-0.5 sm:gap-1 w-full aspect-square border sm:border-2 text-white font-bold tracking-tighter sm:tracking-normal text-[clamp(6px,1.15vw,13px)] leading-tight text-center break-words sm:break-normal rounded sm:rounded-lg p-0.5 sm:p-1.5 transition-all duration-300 ${getBgColor(attr.status)}`}
                  style={{ animationDelay: `${(attrIdx + 1) * 0.4}s` }}
                >
                  <span className="line-clamp-3">
                    {Array.isArray(attr.value) ? attr.value.join(', ') : attr.value}
                  </span>
                  {attr.status === 'higher' && <span className="text-[clamp(9px,1.4vw,15px)] font-black">↑</span>}
                  {attr.status === 'lower' && <span className="text-[clamp(9px,1.4vw,15px)] font-black">↓</span>}
                </div>
              ))}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
