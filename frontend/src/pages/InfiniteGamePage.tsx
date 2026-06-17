import { useEffect, useState } from 'react';
import { getChampionNames } from '../api/champions.api';
import { sendInfiniteGuess, getInfiniteChamp } from '../api/infinitegame.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
import { HistoryGrid } from '../components/Game/HistoryGrid';
import { GameForm } from '../components/Game/GameForm';
import { VictoryCard } from '../components/Game/VictoryCard';

function InfiniteGamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [secretChampion, setSecretChampion] = useState<string>('');

  const startNewGame = async () => {
    try {
      setInputValue('');
      setGuesses([]);
      setSuggestions([]);
      setHasWon(false);
      setShowVictory(false);
      
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
    if (guesses.some(g => g.name.toLowerCase() === validChamp.name.toLowerCase())) return;
    
    try {
      const result = await sendInfiniteGuess(validChamp.name, secretChampion);
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
      <Heading>Infinite mode</Heading>
      <h2> Vous pouvez jouer autant que vous le souhaitez ! </h2>
      
      {error && <div className="error-alert">{error}</div>}

      {showVictory && (
        <VictoryCard 
          guessCount={guesses.length} 
          onReplay={startNewGame} 
        />
      )}

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

export default InfiniteGamePage;