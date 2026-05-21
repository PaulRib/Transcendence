import { useEffect, useState } from 'react';
import { getChampionNames, type ChampionName } from '../api/champions.api';
import { sendInfiniteGuess, type GuessResponse } from '../api/infinitechampion.api';
import '../css/Game.css'
import { getInfiniteChamp } from '../api/infinitechampion.api';

function InfiniteGamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [secretChampion, setSecretChampion] = useState<string>('');


  const startNewGame = async () => {
    try {
      setInputValue('');
      setGuesses([]);
      setSuggestions([]);
      setHasWon(false);
      
      const randomChamp = await getInfiniteChamp();
      setSecretChampion(randomChamp.id);
    } catch {
      setError("Can't load a new champion. Please retry later !");
    }
  };

  useEffect(() => {
	async function loadGameData() {
	  try {
		setIsLoading(true);
		const names = await getChampionNames();
		setChampionNames(names);
		startNewGame();
		setError(null);
	  } catch {
		setError("Can't load game data. Please retry later !");
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
	const validChamp = championNames.find(c => c.name.toLowerCase() === inputValue.toLowerCase());
	if (!validChamp) {
	  alert("This champion does not exist !");
	  return;
	}
	const isAlreadyGuessed = guesses.some(g => g.name.toLowerCase() === validChamp.name.toLowerCase());
	if (isAlreadyGuessed) return;
	
	try {
	  const result = await sendInfiniteGuess(validChamp.name, secretChampion);
	  setGuesses([result, ...guesses]);
	  setInputValue('');
	  setSuggestions([]);
	  if (result.isWin) {
		setHasWon(true);
	  }
	} catch (err) {
	  console.error(err);
	  alert("Error during the try");
	}
  };

  if (isLoading) {
	return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement du jeu...</div>;
  }

  const isInputValid = championNames.some(c => c.name.toLowerCase() === inputValue.trim().toLowerCase());

  return (
	<section className="game-section">
	  <h2>Infinite mode</h2>
	  
	  {error && <div className="error-alert">{error}</div>}

		{hasWon && (
		<div className="victory-card">
			<h2 className="victory-title">Félicitations ! Vous avez trouvé !</h2>
			<button className="replay-btn" onClick={startNewGame}>
			Rejouer
			</button>
		</div>
		)}

	  {/* Formulaire de saisie */}
	  <form onSubmit={handleSubmitGuess} className="search-form">
		<div className="input-container">
		  <input
			type="text"
			placeholder="Enter a champ name..."
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

		{/* Menu déroulant de suggestions */}
		{suggestions.length > 0 && (
		  <ul className="suggestions-list">
			{suggestions.map((champion) => (
			  <li
				key={champion.name}
				onClick={() => handleSelectChampion(champion.name)}
				className="suggestion-item"
			  >
				{champion.name}
			  </li>
			))}
		  </ul>
		)}
	  </form>

	  {/* Section de l'historique des tentatives */}
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

		  {guesses.map((guess, index) => {
			const imageFilename = guess.name.toLowerCase().replace(/[^a-z0-9]/g, '');

			return (
			  <div key={index} className="guess-row">
				
				{/* 1. Case Image + Nom du Champion */}
				<div className="champion-avatar-cell">
				  <img 
					src={`/champions/${imageFilename}.png`} 
					className="champion-avatar-img"
				  />
				</div>

				{/* 2. Case Genre */}
				<div className={`guess-box ${guess.gender?.status || ''}`}>
				  {guess.gender?.value}
				</div>

				{/* 3. Case Position */}
				<div className={`guess-box ${guess.positions?.status || ''}`}>
				  {Array.isArray(guess.positions?.value) ? guess.positions.value.join(', ') : guess.positions?.value}
				</div>

				{/* 4. Case Espèce */}
				<div className={`guess-box ${guess.species?.status || ''}`}>
				  {Array.isArray(guess.species?.value) ? guess.species.value.join(', ') : guess.species?.value}
				</div>

				{/* 5. Case Type de Ressource */}
				<div className={`guess-box ${guess.resource_type?.status || ''}`}>
				  {guess.resource_type?.value}
				</div>

				{/* 6. Case Type de Portée */}
				<div className={`guess-box ${guess.range_type?.status || ''}`}>
				  {Array.isArray(guess.range_type?.value) ? guess.range_type.value.join(', ') : guess.range_type?.value}
				</div>

				{/* 7. Case Région */}
				<div className={`guess-box ${guess.region?.status || ''}`}>
				  {Array.isArray(guess.region?.value) ? guess.region.value.join(', ') : guess.region?.value}
				</div>

				{/* 8. Case Année de sortie */}
				<div className={`guess-box ${guess.release_year?.status || ''}`}>
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

export default InfiniteGamePage;