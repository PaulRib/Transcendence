import { useEffect, useState } from 'react';
import { getChampionNames, type ChampionName } from '../api/champions.api';
import { sendGuess, type GuessResponse } from '../api/dailychampion.api';

function GamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGameData() {
      try {
        setIsLoading(true);
        const names = await getChampionNames();
        setChampionNames(names);
		setError(null);
      } catch {
        console.error(error);
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

		const filtered = championNames.filter((champion) => champion.name.toLowerCase().startsWith(text.toLowerCase())
		);
		setSuggestions(filtered);
	};

	const handleSubmitGuess = async(event: React.FormEvent) => {
		event.preventDefault();
		const validChamp = championNames.find(c => c.name.toLowerCase() === inputValue.toLowerCase());
		if (!validChamp) {
			alert("This champion does not exist !");
			return;
		}
		try {
			const result = await sendGuess(validChamp.name);
			//setGuesses (pour compter le nombre de coup)
			setInputValue('');
		} catch (err) {
			console.error(err);
			alert("Error during the try");
		}
	};

	if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement du jeu...</div>;
  }

	return (
		<section style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
		<h2>LoLDle Prototype</h2>
		{error && (
        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

		{/* Formulaire de saisie (le fameux rectangle) */}
		<form onSubmit={handleSubmitGuess} style={{ position: 'relative', marginBottom: '20px' }}>
			<div style={{ display: 'flex', gap: '10px' }}>
			<input
				type="text"
				placeholder="Enter a champ name..."
				value={inputValue}
				onChange={(e) => handleInputChange(e.target.value)}
				style={{ padding: '10px', flex: 1, fontSize: '16px' }}
			/>
			<button type="submit" style={{ padding: '10px 20px' }}>Valider</button>
			</div>

			{/* Menu déroulant de suggestions fait maison */}
			{suggestions.length > 0 && (
			<ul style={{
				position: 'absolute',
				top: '100%',
				left: 0,
				right: 0,
				backgroundColor: 'rgb(8, 18, 40)',
				border: '1px solid rgb(48, 48, 48)',
				listStyle: 'none',
				margin: 0,
				padding: 0,
				maxHeight: '200px',
				overflowY: 'auto',
				zIndex: 10
			}}>
				{suggestions.map((champion) => (
				<li
					key={champion.name}
					onClick={() => handleSelectChampion(champion.name)}
					style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid rgb(48, 48, 48)' }}
				>
					{champion.name}
				</li>
				))}
			</ul>
			)}
		</form>

		{/* C'est ici que tu afficheras tes lignes d'essais plus tard */}
		<div>
			<h3>Tentatives ({guesses.length})</h3>
			{guesses.map((guess, index) => (
			<div key={index} style={{ padding: '10px', border: '1px solid #fbfbfb', marginBottom: '5px' }}>
				<strong>{guess.name}</strong> - Genre: {guess.gender.value} ({guess.gender.status})
			</div>
			))}
		</div>
		</section>
	);
	}

export default GamePage;