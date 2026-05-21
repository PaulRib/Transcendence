import { useEffect, useState } from 'react';
import { getChampionNames, type ChampionName } from '../api/champions.api';
import { sendGuess, type GuessResponse } from '../api/dailychampion.api';
import '../css/Game.css'

function ClassicGamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);

  useEffect(() => {
    async function loadGameData() {
      try {
        setIsLoading(true);
        const names = await getChampionNames();
        setChampionNames(names);
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
  	if (isAlreadyGuessed)
		return;
    try {
      const result = await sendGuess(validChamp.name);
      
      // FIX : On ajoute le résultat de l'API à notre historique d'essais
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

  // Vérification en temps réel pour activer/désactiver le bouton
  const isInputValid = championNames.some(c => c.name.toLowerCase() === inputValue.trim().toLowerCase());

  return (
    <section style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Classic mode</h2>
      {error && (
        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
	{hasWon && (
		<div style={{
			backgroundColor: 'rgba(40, 167, 69, 0.2)',
			border: '3px solid #28a745',
			borderRadius: '8px',
			padding: '20px',
			textAlign: 'center',
			marginBottom: '20px',
			boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
		}}>
			<h2 style={{ color: '#28a745', margin: 0, fontSize: '24px' }}>🎉 Victoire ! 🎉</h2>
			<p>Félicitations, tu as trouvé le champion du jour en {guesses.length} essais !</p>
		</div>
	)}
      {/* Formulaire de saisie */}
      <form onSubmit={handleSubmitGuess} style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter a champ name..."
            value={inputValue}
			disabled={hasWon}
            onChange={(e) => handleInputChange(e.target.value)}
            style={{ padding: '10px', flex: 1, fontSize: '16px' }}
          />
          <button 
            type="submit" 
            disabled={!isInputValid}
            style={{ 
              padding: '10px 20px',
              backgroundColor: isInputValid ? '#28a745' : '#ccc',
              color: '#fff',
              border: 'none',
              cursor: isInputValid ? 'pointer' : 'not-allowed'
            }}
          >
            Valider
          </button>
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
                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid rgb(48, 48, 48)', color: '#fff' }}
              >
                {champion.name}
              </li>
            ))}
          </ul>
        )}
      </form>

{/* Section de l'historique des tentatives */}
      <div style={{ marginTop: '30px', overflowX: 'auto' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '600px' }}>
          
          {guesses.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
              <div style={{ width: '80px' }}>Champion</div>
              <div style={{ width: '80px' }}>Genre</div>
              <div style={{ width: '80px' }}>Position</div>
              <div style={{ width: '80px' }}>Espèce</div>
              <div style={{ width: '80px' }}>Ressource</div>
              <div style={{ width: '80px' }}>Portée</div>
              <div style={{ width: '80px' }}>Région</div>
              <div style={{ width: '80px' }}>Année</div>
            </div>
          )}

          {guesses.map((guess, index) => {
            // 1. Calcul du nom de fichier nettoyé pour l'image (ex: "dr. mundo" -> "drmundo")
            const imageFilename = guess.name.toLowerCase().replace(/[^a-z0-9]/g, '');

            // 2. Le return unique et propre pour chaque ligne de tentative
            return (
              <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                
                {/* 1. Case Image + Nom du Champion (Combinés pour être plus compact) */}
                <div style={{ width: '80px', textAlign: 'center' }}>
                  <img 
                    src={`/champions/${imageFilename}.png`} 
                    style={{ width: '80px', height: '80px', borderRadius: '4px', display: 'block', margin: '0 auto' }}
                  />
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    display: 'block', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                  </span>
                </div>

                {/* 2. Case Genre (Correct / Incorrect) */}
                <div className={`guess-box ${guess.gender?.status || ''}`}>
                  {guess.gender?.value}
                </div>

                {/* 3. Case Position (Correct / Partial / Incorrect) */}
                <div className={`guess-box ${guess.positions?.status || ''}`}>
                  {Array.isArray(guess.positions?.value) ? guess.positions.value.join(', ') : guess.positions?.value}
                </div>

                {/* 4. Case Espèce (Correct / Partial / Incorrect) */}
                <div className={`guess-box ${guess.species?.status || ''}`}>
                  {Array.isArray(guess.species?.value) ? guess.species.value.join(', ') : guess.species?.value}
                </div>

                {/* 5. Case Type de Ressource (Correct / Incorrect) */}
                <div className={`guess-box ${guess.resource_type?.status || ''}`}>
                  {guess.resource_type?.value}
                </div>

                {/* 6. Case Type de Portée (Correct / Partial / Incorrect) */}
                <div className={`guess-box ${guess.range_type?.status || ''}`}>
                  {Array.isArray(guess.range_type?.value) ? guess.range_type.value.join(', ') : guess.range_type?.value}
                </div>

                {/* 7. Case Région (Correct / Partial / Incorrect) */}
                <div className={`guess-box ${guess.region?.status || ''}`}>
                  {Array.isArray(guess.region?.value) ? guess.region.value.join(', ') : guess.region?.value}
                </div>

                {/* 8. Case Année de sortie (Correct / Higher / Lower) */}
                <div className={`guess-box ${guess.release_year?.status || ''}`}>
                  {guess.release_year?.value}
                  {guess.release_year?.status === 'higher' && <span style={{ fontSize: '18px' }}>↑</span>}
                  {guess.release_year?.status === 'lower' && <span style={{ fontSize: '18px' }}>↓</span>}
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