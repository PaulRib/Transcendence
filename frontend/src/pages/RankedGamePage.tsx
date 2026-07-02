import { useEffect, useState } from 'react';
import { getChampionNames } from '../api/champions.api';
import type { ChampionName, GuessResponse } from '../api/type.api';
import { PageContainer } from '../components/ui/page-content';
import { useGameUniverse } from '../context/GameUniverseContext';
import { Navigate} from 'react-router-dom';
import { HistoryGrid } from '../components/Game/HistoryGrid';
import { GameForm } from '../components/Game/GameForm';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import type { Socket } from 'socket.io-client';
import { GameOverCard } from '../components/Game/GameOverCard';
import { getCurrentUser } from '../api/auth.api';

interface RankedGamePageProps {
  socket: Socket;
  matchId: string;
  starterUserId: string | null;
  initialMatchData?: any | null;
}

function RankedGamePage({ socket, matchId, starterUserId, initialMatchData }: RankedGamePageProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionName[]>([]);
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [opponentGuesses, setOpponentGuesses] = useState<Array<{name: string, imagePath: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);
  const [gameOverInfo, setGameOverInfo] = useState<{ isDraw: boolean; winnerId: string; reason?: string } | null>(null);
  const [lastChance, setLastChance] = useState<boolean>(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState<boolean>(false);
  const [disconnectCountdown, setDisconnectCountdown] = useState<number>(60);

  const { t } = useLanguage();
  const { universe } = useGameUniverse();
  const { currentUser, updateCurrentUser } = useAuth();

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

  // Restaurer l'historique de la partie si initialMatchData est présent au montage
  useEffect(() => {
    if (initialMatchData) {
      const myParticipant = initialMatchData.participants.find(
        (p: any) => p.user_id === currentUser?.id
      );
      if (myParticipant) {
        const myGuessesRaw = initialMatchData.guesses.filter(
          (g: any) => g.participant_id === myParticipant.id
        );
        const opponentGuessesRaw = initialMatchData.guesses.filter(
          (g: any) => g.participant_id !== myParticipant.id
        );

        const restoredGuesses: GuessResponse[] = myGuessesRaw.map((g: any) => ({
          id: g.champion.id,
          name: g.champion.name,
          isWin: g.is_correct,
          ...g.comparison_result
        })).reverse();

        const restoredOpponentGuesses = opponentGuessesRaw.map((g: any) => {
          const name = g.champion.name;
          const imagePath = `/champions/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`;
          return { id: g.champion.id, name, imagePath };
        }).reverse();

        setGuesses(restoredGuesses);
        setOpponentGuesses(restoredOpponentGuesses);

        // Déterminer à qui est le tour en comparant les essais
        const myCount = restoredGuesses.length;
        const oppCount = restoredOpponentGuesses.length;

        if (myCount < oppCount) {
          setIsMyTurn(true);
        } else if (myCount > oppCount) {
          setIsMyTurn(false);
        } else {
          // Égalité : le tour dépend du starter de la partie
          if (starterUserId) {
            setIsMyTurn(currentUser?.id === starterUserId);
          } else {
            setIsMyTurn(true);
          }
        }
      }
    } else {
      // Cas classique : le starter commence
      setIsMyTurn(starterUserId ? currentUser?.id === starterUserId : true);
    }
  }, [initialMatchData, currentUser, starterUserId]);

  // Timer de déconnexion de l'adversaire
  useEffect(() => {
    let interval: any;
    if (opponentDisconnected && disconnectCountdown > 0) {
      interval = setInterval(() => {
        setDisconnectCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [opponentDisconnected, disconnectCountdown]);

  useEffect(() => {
    if (!socket) return;

    socket.on('guess_result_full', (result: GuessResponse) => {
      setGuesses((prev) => [result, ...prev]);
      if (result.isWin) {
        setHasWon(true);
      }
    });

    socket.on('guess_result_spectator', async (data: { name: string }) => {
      try {
		if (data && data.name != null) {
				const name = data.name;
				const imagePath = `/champions/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`;
				setOpponentGuesses((prev) => [{ name, imagePath }, ...prev]);
			}
		else {
			setOpponentGuesses((prev) => [{id: 'hidden', name: 'Champion', imagePath: '/champions/unknown.png'}, ...prev]);
		}
		}
    	catch (err) {
			console.error("Error fetching opponent champion info:", err);
			setOpponentGuesses((prev) => [
			{
				name: "Champion",
				imagePath: "/champions/unknown.png",
			},
			...prev,
			]);
		}
      setIsMyTurn(true);
    });

    socket.on('last_chance_triggered', () => {
      setLastChance(true);
      setIsMyTurn(true);
    });

    socket.on('game_over', async (data: { isDraw: boolean; winnerId: string; reason?: string }) => {
      setGameOverInfo(data);
      if (data.winnerId === currentUser?.id) {
        setHasWon(true);
      }

	  if (!data.isDraw) {
		if (currentUser) {
		  try {
			const refreshedUser = await getCurrentUser();
			updateCurrentUser(refreshedUser);
		  } catch (error) {
			console.error("Impossible de mettre à jour l'Elo :", error);
		  }
		}
	  }
      
      // Delay showing the GameOverCard by 3.5 seconds so flip animations can finish, except if it is a forfeit
      if (data.reason === 'opponent_disconnected') {
        setShowVictory(true);
      } else {
        setTimeout(() => {
          setShowVictory(true);
        }, 3500);
      }
    });

    socket.on('game_error', (data: { message: string }) => {
      alert(`${t("multiplayer.gameError")}${data.message}`);
      setIsMyTurn(true);
    });

    // ÉCOUTES DES ÉVÉNEMENTS DE DÉCONNEXION TEMPORAIRE ET DE RETOUR
    socket.on('player_disconnected_grace', (data: { userId: string; username: string; reconnectWindowMs: number }) => {
      console.log("player_disconnected_grace reçu :", data);
      if (data.userId !== currentUser?.id) {
        setOpponentDisconnected(true);
        setDisconnectCountdown(Math.round(data.reconnectWindowMs / 1000));
      }
    });

    socket.on('player_reconnected', (data: { userId: string; username: string }) => {
      console.log("player_reconnected reçu :", data);
      if (data.userId !== currentUser?.id) {
        setOpponentDisconnected(false);
        setDisconnectCountdown(60);
      }
    });

    return () => {
      socket.off('guess_result_full');
      socket.off('guess_result_spectator');
      socket.off('last_chance_triggered');
      socket.off('game_over');
      socket.off('game_error');
      socket.off('player_disconnected_grace');
      socket.off('player_reconnected');
    };
  }, [socket, matchId, currentUser, t, starterUserId, updateCurrentUser]);

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
    if (!isMyTurn || gameOverInfo) return;

    const validChamp = championNames.find(c => c.name.toLowerCase() === inputValue.toLowerCase());
    if (!validChamp) {
      alert(t("game.invalidChampion"));
      return;
    }
    if (guesses.some(g => g.name.toLowerCase() === validChamp.name.toLowerCase())) return;

    setIsMyTurn(false);

    try {
      socket.emit('submit_guess', { GuessedChamp: validChamp.name, matchId });
      setInputValue('');
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      alert(t("game.tryError"));
      setIsMyTurn(true);
    }
  };

  const handleReplay = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>{t("game.loading")}</div>;
  }

  const isInputValid = championNames.some(c => c.name.toLowerCase() === inputValue.trim().toLowerCase());

  if (universe === 'country') {
    return <Navigate to="/countrydle" replace />;
  }

  return (
    <PageContainer className="game-PageContainer !max-w-[1200px] w-full">
      <div className="text-center mb-6">
        <Heading>{t("game.rankedTitle")}</Heading>
        <div className="text-sm text-slate-400 mt-1">{t("multiplayer.matchId")} <span className="font-mono text-xs text-amber-500">{matchId}</span></div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {showVictory && gameOverInfo && (
        <div className="flex justify-center mb-8">
          <GameOverCard 
            info={gameOverInfo} 
            myId={currentUser?.id || ''} 
            guessCount={guesses.length}
            onReplay={handleReplay} 
          />
        </div>
      )}

      {opponentDisconnected && (
        <div className="w-full mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-center text-sm font-bold uppercase rounded-xl animate-pulse flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          {t("multiplayer.opponentDisconnectedGrace").replace("{count}", String(disconnectCountdown))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
        
        {/* Left Column: Player (You) */}
        <div className="lg:col-span-8 flex flex-col items-center bg-slate-900/40 border border-white/5 rounded-2xl p-6 shadow-xl relative min-h-[500px]">
          
          <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400">
                {t("multiplayer.youInitials")}
              </div>
              <span className="font-semibold text-slate-200">{currentUser?.username || t("multiplayer.you")}</span>
            </div>

            {!gameOverInfo && (
              isMyTurn ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {t("multiplayer.yourTurn")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase rounded-full">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  {t("multiplayer.opponentThinking")}
                </span>
              )
            )}
          </div>

          {lastChance && !gameOverInfo && (
            <div className="w-full mb-4 px-4 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-center text-sm font-bold uppercase rounded-lg animate-pulse">
              {t("multiplayer.lastChanceWarning")}
            </div>
          )}

          <GameForm
            inputValue={inputValue}
            hasWon={hasWon || !isMyTurn || !!gameOverInfo}
            isInputValid={isInputValid}
            placeholder={isMyTurn ? t("game.inputPlaceholder") : t("multiplayer.waitTurn")}
            suggestions={suggestions.map(c => ({
              name: c.name,
              imagePath: `/champions/${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`
            }))}
            onInputChange={handleInputChange}
            onSelectEntity={handleSelectChampion}
            onSubmit={handleSubmitGuess}
          />

          <div className="w-full mt-6">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 text-center">{t("multiplayer.yourHistory")}</h3>
            {guesses.length > 0 ? (
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
            ) : (
              <div className="text-slate-500 text-sm text-center py-8">{t("multiplayer.noAttemptsYet")}</div>
            )}
          </div>
        </div>

        {/* Right Column: Opponent */}
        <div className="lg:col-span-4 flex flex-col items-center bg-slate-900/40 border border-white/5 rounded-2xl p-6 shadow-xl relative min-h-[500px]">
          
          <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                {t("multiplayer.opponentInitials")}
              </div>
              <span className="font-semibold text-slate-200">{t("multiplayer.opponent")}</span>
            </div>

            {!gameOverInfo && (
              !isMyTurn ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {t("multiplayer.opponentPlaying")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase rounded-full">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  {t("multiplayer.opponentWaiting")}
                </span>
              )
            )}
          </div>

          <div className="w-full">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4 text-center">{t("multiplayer.opponentAttempts")}</h3>
            
            {opponentGuesses.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-4 justify-items-center">
                {opponentGuesses.map((g, idx) => {
                  const isHidden = lastChance && !gameOverInfo && idx === 0;

                  return (
                    <div key={g.name} className="flex flex-col items-center gap-1 animate-pop-in">
                      <span className="text-[10px] text-slate-400 font-semibold">{t("multiplayer.attemptCount").replace("{count}", String(opponentGuesses.length - idx))}</span>
                      <div className="w-[72px] h-[72px] rounded-lg overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center shadow-lg relative group">
                        {isHidden ? (
                          <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-yellow-600/30 flex items-center justify-center text-amber-400 font-extrabold text-2xl animate-pulse">
                            ❓
                          </div>
                        ) : (
                          <img src={g.imagePath} alt={g.name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1">
                          <span className="text-[9px] text-white text-center font-bold break-all leading-tight">
                            {isHidden ? t("multiplayer.secretChampion") : g.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-slate-500 text-sm text-center py-8">{t("multiplayer.noOpponentAttempts")}</div>
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
}

export default RankedGamePage;
