import { useEffect, useState } from 'react';
import { getChampionNames } from '../api/champions.api';
import { getDailyData, sendGuess } from '../api/dailygame.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
import { useGameUniverse } from '../context/GameUniverseContext';
// Import des nouveaux composants mutualisés
import { HistoryGrid } from '../components/Game/HistoryGrid';
import { GameForm } from '../components/Game/GameForm';
import { VictoryCard } from '../components/Game/VictoryCard';
import { rewardWin } from '../api/gamification.api';
import { useLanguage } from '../i18n/LanguageContext';
import { Navigate } from 'react-router-dom';

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
  const [matchId, setMatchId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { universe } = useGameUniverse();

  useEffect(() => {
    async function loadGameData() {
      try {
        setIsLoading(true);
        
        // On récupère en parallèle les noms des champions et les infos du match du jour
        const [names, dailyData] = await Promise.all([
          getChampionNames(),
          getDailyData()
        ]);
        
        setChampionNames(names);
        setMatchId(dailyData.id);

        const savedState = localStorage.getItem('daily_classic_game');
        if (savedState) {
          try {
            const parsed = JSON.parse(savedState);
            if (parsed && parsed.matchId === dailyData.id) {
              setGuesses(parsed.guesses || []);
              setHasWon(!!parsed.hasWon);
              if (parsed.hasWon) {
                setShowVictory(true);
              }
            } else {
              localStorage.removeItem('daily_classic_game');
            }
          } catch {
            localStorage.removeItem('daily_classic_game');
          }
        }
        setError(null);
      } catch (err) {
        console.error("Erreur de chargement du jeu quotidien:", err);
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
      alert(t("game.invalidChampion"));
      return;
    }
    if (guesses.some(g => g.name.toLowerCase() === validChamp.name.toLowerCase())) return;

    try {
      const result = await sendGuess(validChamp.name);
      const newGuesses = [result, ...guesses];
      const isWin = result.isWin;
      const newHasWon = isWin || hasWon;

      setGuesses(newGuesses);
      setInputValue('');
      setSuggestions([]);

      if (isWin) {
        setHasWon(true);

        const token = localStorage.getItem('access_token');

        if (token) {
          const attempts = guesses.length + 1;
          const rewardResponse = await rewardWin(token, attempts);

          if (rewardResponse.rewardGiven) {
            setRewardMessage(t("game.rewardEarned")
              .replace("{xp}", String(rewardResponse.xpEarned)));
          } else {
            setRewardMessage(t("game.rewardAlreadyClaimed"));
          }
        } else {
          setRewardMessage(t("game.loginForReward"));
        }

        setTimeout(() => setShowVictory(true), 3750);
      }

      if (matchId) {
        localStorage.setItem('daily_classic_game', JSON.stringify({
          matchId: matchId,
          guesses: newGuesses,
          hasWon: newHasWon
        }));
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
    <PageContainer>
      <Heading>{t("game.classicTitle")}</Heading>
      <h2>{t("game.classicSubtitle")}</h2>

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

export default ClassicGamePage;
