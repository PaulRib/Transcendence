import { useEffect, useState } from 'react';
import { getChampionNames } from '../api/champions.api';
import { sendGuess } from '../api/dailygame.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import { PageContainer } from '../components/ui/page-content';
import { useGameUniverse } from '../context/GameUniverseContext';
import { Navigate } from 'react-router-dom';
import { HistoryGrid } from '../components/Game/HistoryGrid';
import { GameForm } from '../components/Game/GameForm';
import { VictoryCard } from '../components/Game/VictoryCard';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';

function RankedGamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const { t } = useLanguage();
  const { universe } = useGameUniverse();

  useEffect(() => {
    async function loadGameData() {
      try {
        setIsLoading(true);
        const names = await getChampionNames();
        setChampionNames(names);
        setError(null);
      } catch {
        setError(t("game.loadError"));
      } finally {
        setIsLoading(false);
      }
    }
    loadGameData();
  }, [t]);

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
      alert(t("game.invalidChampion"));
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
      alert(t("game.tryError"));
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>{t("game.loading")}</div>;
  }

  const isInputValid = championNames.some(c => c.name.toLowerCase() === inputValue.trim().toLowerCase());

  if (universe === 'country') {
    return <Navigate to="/countrydle" replace />;
  }

  return (
    <PageContainer className="game-PageContainer">
      <Heading>{t("game.rankedTitle")}</Heading>

      {error && <div className="error-alert">{error}</div>}

      {showVictory && <VictoryCard guessCount={guesses.length} />}

      <GameForm
        inputValue={inputValue}
        hasWon={hasWon}
        isInputValid={isInputValid}
        placeholder="Entrez un nom de champion..."
        suggestions={suggestions.map(c => ({
          name: c.name,
          imagePath: `/champions/${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`
        }))}
        onInputChange={handleInputChange}
        onSelectEntity={handleSelectChampion}
        onSubmit={handleSubmitGuess}
      />

      <HistoryGrid
        columns={[t("game.champion"), t("game.gender"), t("game.position"), t("game.species"), t("game.resource"), t("game.range"), t("game.region"), t("game.year")]}
        guesses={guesses.map(g => ({
          entity: {
            name: g.name,
            imagePath: `/champions/${g.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`
          },
          isWin: g.isWin,
          attributes: [
            g.gender,
            g.positions,
            g.species,
            g.resource_type,
            g.range_type,
            g.region,
            g.release_year
          ]
        }))}
      />
    </PageContainer>
  );
}

export default RankedGamePage;