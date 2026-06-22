import type { GuessResponse } from '../../api/type.api';
import { useLanguage } from '../../i18n/LanguageContext';

interface HistoryGridProps {
  guesses: GuessResponse[];
}

export function HistoryGrid({ guesses }: HistoryGridProps) {
  const { t } = useLanguage();
  return (
    <div className="mt-8 overflow-x-auto w-full flex flex-col items-center">
      <div className="flex flex-col gap-2 min-w-[600px]">
        
        {/* En-tête de la grille */}
        <div className="flex gap-1.5 font-bold text-xs text-center justify-center mb-1">
          <div className="w-[72px]">{t("game.champion")}</div>
          <div className="w-[72px]">{t("game.gender")}</div>
          <div className="w-[72px]">{t("game.position")}</div>
          <div className="w-[72px]">{t("game.species")}</div>
          <div className="w-[72px]">{t("game.resource")}</div>
          <div className="w-[72px]">{t("game.range")}</div>
          <div className="w-[72px]">{t("game.region")}</div>
          <div className="w-[72px]">{t("game.year")}</div>
        </div>

        {/* Lignes de l'historique */}
        {guesses.map((guess, index) => {
          const imageFilename = guess.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          const getBgColor = (status?: string) => {
            if (status === 'correct') return 'bg-[#28a745]';
            if (status === 'partial') return 'bg-[#da8b1b]';
            return 'bg-[#dc3545]';
          };

          return (
            <div key={guess.name || index} className="flex gap-1.5 items-center justify-center">
              
              {/* Image Champion */}
              <div className="champion-avatar-cell w-[72px] flex justify-center" style={{ animationDelay: '0s' }}>
                <img 
                  src={`/champions/${imageFilename}.png`} 
                  className="w-[72px] h-[72px] rounded-md object-cover block mx-auto border-2 border-black shadow-md" 
                  alt={guess.name} 
                />
              </div>

              {/* Genre */}
              <div 
                className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-black text-white font-bold text-[11px] text-center capitalize rounded-md p-1 shadow-md ${getBgColor(guess.gender?.status)}`}
                style={{ animationDelay: '0.45s' }}
              >
                {guess.gender?.value}
              </div>

              {/* Position */}
              <div 
                className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-black text-white font-bold text-[11px] text-center capitalize rounded-md p-1 shadow-md ${getBgColor(guess.positions?.status)}`}
                style={{ animationDelay: '0.90s' }}
              >
                {Array.isArray(guess.positions?.value) ? guess.positions.value.join(', ') : guess.positions?.value}
              </div>

              {/* Espèce */}
              <div 
                className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-black text-white font-bold text-[11px] text-center capitalize rounded-md p-1 shadow-md ${getBgColor(guess.species?.status)}`}
                style={{ animationDelay: '1.35s' }}
              >
                {Array.isArray(guess.species?.value) ? guess.species.value.join(', ') : guess.species?.value}
              </div>

              {/* Ressource */}
              <div 
                className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-black text-white font-bold text-[11px] text-center capitalize rounded-md p-1 shadow-md ${getBgColor(guess.resource_type?.status)}`}
                style={{ animationDelay: '1.80s' }}
              >
                {guess.resource_type?.value}
              </div>

              {/* Portée */}
              <div 
                className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-black text-white font-bold text-[11px] text-center capitalize rounded-md p-1 shadow-md ${getBgColor(guess.range_type?.status)}`}
                style={{ animationDelay: '2.25s' }}
              >
                {Array.isArray(guess.range_type?.value) ? guess.range_type.value.join(', ') : guess.range_type?.value}
              </div>

              {/* Région */}
              <div 
                className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-black text-white font-bold text-[11px] text-center capitalize rounded-md p-1 shadow-md ${getBgColor(guess.region?.status)}`}
                style={{ animationDelay: '2.70s' }}
              >
                {Array.isArray(guess.region?.value) ? guess.region.value.join(', ') : guess.region?.value}
              </div>

              {/* Année */}
              <div 
                className={`guess-box flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-black text-white font-bold text-[11px] text-center capitalize rounded-md p-1 shadow-md ${getBgColor(guess.release_year?.status)}`}
                style={{ animationDelay: '3.15s' }}
              >
                <span>{guess.release_year?.value}</span>
                {guess.release_year?.status === 'higher' && <span className="text-base leading-none">↑</span>}
                {guess.release_year?.status === 'lower' && <span className="text-base leading-none">↓</span>}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}