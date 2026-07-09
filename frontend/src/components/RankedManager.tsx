import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import RankedLobbyPage from '../pages/RankedLobbyPage';
import RankedGamePage from '../pages/RankedGamePage';
import { useSocialSocket } from '@/context/SocialSocketContext';
import { useLanguage } from '@/i18n/LanguageContext';

function RankedManager() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<'lobby' | 'waiting' | 'playing'>('lobby');
  const [matchId, setMatchId] = useState<string | null>(null);
  const [starterUserId, setStarterUserId] = useState<string | null>(null);
  const [initialMatchData, setInitialMatchData] = useState<any | null>(null);
  const { acceptedGameInvite, clearAcceptedGameInvite } = useSocialSocket();
  const { t } = useLanguage();

  useEffect(() => {
    const newSocket = io(`${window.location.origin}/game`, { 
		path: "/ws",
		withCredentials: true
	});
    
    setSocket(newSocket);

    newSocket.on('active_match_found', (data: { matchId: string; matchData: any; starterUserId: string | null }) => {
      console.log("Match actif trouvé lors de la connexion, reconnexion...", data.matchId);
      setMatchId(data.matchId);
      setInitialMatchData(data.matchData);
      setStarterUserId(data.starterUserId);
	  if (!data.starterUserId)
      	setMatchState('waiting');
	  else
		setMatchState('playing');
      
      newSocket.emit('join_game_room', { matchId: data.matchId });
    });

    newSocket.on('match_found', (data: { matchId: string; matchData?: any }) => {
      console.log("Match trouvé !", data.matchId);
      setMatchId(data.matchId);
      if (data.matchData) {
        setInitialMatchData(data.matchData);
      }
      setMatchState('waiting');
      
      newSocket.emit('join_game_room', { matchId: data.matchId });
    });

    newSocket.on('game_ready', (data?: { starterUserId?: string; matchData?: any }) => {
      console.log("Les deux joueurs sont connectés, c'est parti !", data);
      if (data?.starterUserId) {
        setStarterUserId(data.starterUserId);
      }
      if (data?.matchData) {
        setInitialMatchData(data.matchData);
      }
      setMatchState('playing');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [t]);

  useEffect(() => {
    if(!socket || !acceptedGameInvite) {
      return ;
    }

    setMatchId(acceptedGameInvite.matchId);
    setMatchState('waiting');

    socket.emit('join_game_room', {
      matchId: acceptedGameInvite.matchId,
    });

    clearAcceptedGameInvite();
  }, [socket, acceptedGameInvite, clearAcceptedGameInvite]);

  return (
    <div className="ranked-container">
      
      {matchState === 'lobby' && (
        <RankedLobbyPage socket={socket} />
      )}
      
      {matchState === 'waiting' && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>{t('multiplayer.preparingArena')}</h2>
          <div className="loader">{t('multiplayer.waitingForOpponent')}</div>
        </div>
      )}
      
      {matchState === 'playing' && matchId && socket && (
        <RankedGamePage 
          socket={socket} 
          matchId={matchId} 
          starterUserId={starterUserId} 
          initialMatchData={initialMatchData}
        />
      )}
      
    </div>
  );
}

export default RankedManager;
