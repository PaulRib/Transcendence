import { useEffect, useState } from 'react';
import { getChampionNames} from '../api/champions.api';
import { sendGuess} from '../api/dailygame.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import '../css/Game.css';

function ClassicGamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);

  useEffect(() => {
    async function loadGameData() {
      try {
        setIsLoading(true);
        const names = await getChampionNames();
        setChampionNames(names);
        setError(null);
      } catch {
        setError("Impossible de charger les données. Réessayez plus tard !");
      } finally {
        setIsLoading(false);
      }
    }
    loadGameData();
  }, []);

  const handleSelectChampion = (championName: string) => {
    setInputValue(championName);
    setSuggestions([]);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);

    if (text.trim() === '') {
      setSuggestions([]);
      return;
    }

    const alreadyGuessedNames = guesses.map(g => g.name.toLowerCase());
    const filtered = championNames.filter((champion) => {
      const matchesText = champion.name.toLowerCase().startsWith(text.toLowerCase());
      const isNotAlreadyGuessed = !alreadyGuessedNames.includes(champion.name.toLowerCase());
      return matchesText && isNotAlreadyGuessed;
    });
 
    setSuggestions(filtered);
  };

  const handleSubmitGuess = async (event: React.FormEvent) => {
    event.preventDefault();
    const validChamp = championNames.find(c => c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === inputValue.toLowerCase().replace(/[^a-z0-9]/g, ''));
	if (!validChamp) {
      alert("Ce champion n'existe pas !");
      return;
    }
    const isAlreadyGuessed = guesses.some(g => g.name.toLowerCase() === validChamp.name.toLowerCase());
    if (isAlreadyGuessed) return;
    
    try {
      const result = await sendGuess(validChamp.name);
      setGuesses([result, ...guesses]);
      setInputValue('');
      setSuggestions([]);
      if (result.isWin) {
        setHasWon(true);
		setTimeout(() => {
			setShowVictory(true);
		}, 3750);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur pendant l'essai");
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement du jeu...</div>;
  }

  const isInputValid = championNames.some(c => c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === inputValue.toLowerCase().replace(/[^a-z0-9]/g, ''));

  return (
    <section className="game-section">
      <h2>Classic mode</h2>
      
      {error && <div className="error-alert">{error}</div>}

      {showVictory && (
        <div className="victory-card">
          <h2 className="victory-title">🎉 Victoire ! 🎉</h2>
          <p>Félicitations, tu as trouvé le champion du jour en {guesses.length} essais !</p>
        </div>
      )}

      {/* Submit Input */}
      <form onSubmit={handleSubmitGuess} className="search-form">
        <div className="input-container">
          <input
            type="text"
            placeholder="Entrez un nom de champion..."
            value={inputValue}
            disabled={hasWon}
            onChange={(e) => handleInputChange(e.target.value)}
            className="search-input"
          />
          <button 
            type="submit" 
            disabled={!isInputValid}
            className={`submit-btn ${isInputValid ? 'valid' : 'invalid'}`}
          >
            Valider
          </button>
        </div>

		{/*Suggestions*/}
		{suggestions.length > 0 && (
		<ul className="suggestions-list">
			{suggestions.map((champion) => {
			const imageFilename = champion.name.toLowerCase().replace(/[^a-z0-9]/g, '');
			return (
				<li
				key={champion.name}
				onClick={() => handleSelectChampion(champion.name)}
				className="suggestion-item"
				style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
				>
				<img 
					src={`/champions/${imageFilename}.png`} 
					alt={champion.name}
					style={{ 
					width: '32px', 
					height: '32px', 
					borderRadius: '4px', 
					objectFit: 'cover',
					border: '1px solid #000' 
					}}
				/>
				<span>{champion.name}</span>
				</li>
			);
			})}
		</ul>
		)}
      </form>

      {/*historique*/}
      <div className="history-container">
        <div className="history-grid">
          
          {guesses.length > 0 && (
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
          )}

          {guesses.map((guess) => {
            const imageFilename = guess.name.toLowerCase().replace(/[^a-z0-9]/g, '');

            return (
              <div key={guess.name} className="guess-row">
                {/*All guess boxes*/}
				
                <div className="champion-avatar-cell" style={{ animationDelay: '0s' }}>
                  <img 
                    src={`/champions/${imageFilename}.png`} 
                    className="champion-avatar-img"
                    alt={guess.name}
                  />
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
    </section>
  );
}

export default ClassicGamePage;