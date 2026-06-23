import { useEffect, useState } from 'react';
import { getChampionNames } from '../api/champions.api';
import { sendGuess } from '../api/dailygame.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
import { useGameUniverse } from '../context/GameUniverseContext';
import { Globe } from 'lucide-react';
// Import des nouveaux composants mutualisés
import { HistoryGrid } from '../components/Game/HistoryGrid';
import { GameForm } from '../components/Game/GameForm';
import { VictoryCard } from '../components/Game/VictoryCard';

function ClassicGamePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const { universe } = useGameUniverse();

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

  if (universe === 'country') {
    return (
      <PageContainer>
        <Heading>Mode Country</Heading>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 border border-white/10 rounded-xl mt-8">
          <Globe size={64} className="text-blue-400 mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-white mb-2">Bientôt disponible !</h2>
          <p className="text-slate-400 text-lg max-w-md">
            L'interface générique est prête. Il ne reste plus qu'à connecter la base de données des pays pour pouvoir jouer.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Heading> Classic Mode </Heading>
      <h2> Devinez le champion du jour, saisissez un nom pour commencer. </h2>
      
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
        columns={["Champion", "Genre", "Position", "Espèce", "Ressource", "Portée", "Région", "Année"]}
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