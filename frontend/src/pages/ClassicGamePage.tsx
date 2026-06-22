import { useEffect, useState } from 'react';
import { getChampionNames } from '../api/champions.api';
import { sendGuess } from '../api/dailygame.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
// Import des nouveaux composants mutualisés
import { HistoryGrid } from '../components/Game/HistoryGrid';
import { GameForm } from '../components/Game/GameForm';
import { VictoryCard } from '../components/Game/VictoryCard';
import { rewardWin } from '../api/gamification.api';

function ClassicGamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

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
    const validChamp = championNames.find(c => c.name.toLowerCase() === inputValue.toLowerCase());
    if (!validChamp) {
      alert("Ce champion n'existe pas !");
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

        const token = localStorage.getItem('access_token');

        if (token) {
          const attempts = guesses.length + 1;
          const rewardResponse = await rewardWin(token, attempts);

          if (rewardResponse.rewardGiven) {
            setRewardMessage(`Récompense gagnée : +${rewardResponse.xpEarned} XP, +${rewardResponse.pointsEarned} points`);
          } else {
            setRewardMessage('Récompense déjà récupérée aujourd’hui.');
          }
        } else {
          setRewardMessage('Connectez-vous pour gagner de l’XP et des points.');
        }

        setTimeout(() => setShowVictory(true), 3750);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur pendant l'essai");
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement du jeu...</div>;
  }

  const isInputValid = championNames.some(c => c.name.toLowerCase() === inputValue.trim().toLowerCase());

  return (
    <PageContainer>
      <Heading> Classic Mode </Heading>
      <h2> Devinez le champion du jour, saisissez un nom pour commencer. </h2>
      
      {error && <div className="error-alert">{error}</div>}

      {showVictory && <VictoryCard guessCount={guesses.length} />}

      {showVictory && rewardMessage && (
        <p className="text-sm text-white/80 mt-2">
          {rewardMessage}
        </p>
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

export default ClassicGamePage;