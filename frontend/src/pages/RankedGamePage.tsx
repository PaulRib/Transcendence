import { useEffect, useState } from 'react';
import { getChampionNames } from '../api/champions.api';
import { sendGuess } from '../api/dailygame.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import { PageContainer } from '../components/ui/page-content';
import { HistoryGrid } from '../components/Game/HistoryGrid';
import { GameForm } from '../components/Game/GameForm';
import { VictoryCard } from '../components/Game/VictoryCard';

function RankedGamePage() {
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
      const searchNormalized = text.toLowerCase().replace(/[^a-z0-9]/g, '');
      const nameNormalized = champion.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchesText = champion.name.toLowerCase().includes(text.toLowerCase()) || nameNormalized.includes(searchNormalized);
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
    if (guesses.some(g => g.name.toLowerCase() === validChamp.name.toLowerCase())) return;
    
    try {
      const result = await sendGuess(validChamp.name);
      setGuesses([result, ...guesses]);
      setInputValue('');
      setSuggestions([]);
      if (result.isWin) {
        setHasWon(true);
        setTimeout(() => setShowVictory(true), 3750);
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
    <PageContainer className="game-PageContainer">
      <h2>Ranked mode</h2>
      
      {error && <div className="error-alert">{error}</div>}

      {showVictory && <VictoryCard guessCount={guesses.length} />}

      <GameForm 
        inputValue={inputValue}
        hasWon={hasWon}
        isInputValid={isInputValid}
        suggestions={suggestions}
        onInputChange={handleInputChange}
        onSelectChampion={handleSelectChampion}
        onSubmit={handleSubmitGuess}
      />

      <HistoryGrid guesses={guesses} />
    </PageContainer>
  );
}

export default RankedGamePage;
