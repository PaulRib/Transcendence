import type { GuessResponse } from '../../api/type.api';

interface HistoryGridProps {
  guesses: GuessResponse[];
}

export function HistoryGrid({ guesses }: HistoryGridProps) {
  return (
    <div className="history-container">
      <div className="history-grid">
        {/* L'en-tête est désormais affiché en permanence */}
        <div className="grid-header">
          <div className="header-cell">Champion</div>
          <div className="header-cell">Genre</div>
          <div className="header-cell">Position</div>
          <div className="header-cell">Espèce</div>
          <div className="header-cell">Ressource</div>
          <div className="header-cell">Portée</div>
          <div className="header-cell">Région</div>
          <div className="header-cell">Année</div>
        </div>

        {guesses.map((guess, index) => {
          const imageFilename = guess.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (
            <div key={guess.name || index} className="guess-row">
              <div className="champion-avatar-cell" style={{ animationDelay: '0s' }}>
                <img src={`/champions/${imageFilename}.png`} className="champion-avatar-img" alt={guess.name} />
              </div>
              <div className={`guess-box ${guess.gender?.status || ''}`} style={{ animationDelay: '0.45s' }}>
                {guess.gender?.value}
              </div>
              <div className={`guess-box ${guess.positions?.status || ''}`} style={{ animationDelay: '0.90s' }}>
                {Array.isArray(guess.positions?.value) ? guess.positions.value.join(', ') : guess.positions?.value}
              </div>
              <div className={`guess-box ${guess.species?.status || ''}`} style={{ animationDelay: '1.35s' }}>
                {Array.isArray(guess.species?.value) ? guess.species.value.join(', ') : guess.species?.value}
              </div>
              <div className={`guess-box ${guess.resource_type?.status || ''}`} style={{ animationDelay: '1.80s' }}>
                {guess.resource_type?.value}
              </div>
              <div className={`guess-box ${guess.range_type?.status || ''}`} style={{ animationDelay: '2.25s' }}>
                {Array.isArray(guess.range_type?.value) ? guess.range_type.value.join(', ') : guess.range_type?.value}
              </div>
              <div className={`guess-box ${guess.region?.status || ''}`} style={{ animationDelay: '2.70s' }}>
                {Array.isArray(guess.region?.value) ? guess.region.value.join(', ') : guess.region?.value}
              </div>
              <div className={`guess-box ${guess.release_year?.status || ''}`} style={{ animationDelay: '3.15s' }}>
                {guess.release_year?.value}
                {guess.release_year?.status === 'higher' && <span className="arrow-indicator">↑</span>}
                {guess.release_year?.status === 'lower' && <span className="arrow-indicator">↓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}