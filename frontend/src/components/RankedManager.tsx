// RankedManager.tsx (Le chef d'orchestre)
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import RankedLobbyPage from '../pages/RankedLobbyPage';
import RankedGamePage from '../pages/RankedGamePage';

function RankedManager({ currentMatchId }: { currentMatchId?: string}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<'lobby' | 'waiting' | 'playing'>('lobby');

  useEffect(() => {
		if (!currentMatchId) {
			setMatchState('lobby');
			return ;
		}

	const token = localStorage.getItem('jwt_token');
	const newSocket = io("http://localhost:game/game", { auth: { token } });
	setSocket(newSocket);

    newSocket.on('connect', () => {
		newSocket.emit('join_game_room', { matchId: currentMatchId});
	});

	newSocket.on('game_ready', () => {
		setMatchState('playing');
	});

	return () => {
      newSocket.disconnect();
 		};
	}, [currentMatchId]);

  if (matchState == 'waiting') return <div>En attente de l'adversaire...</div>;

  return (
    <div className="ranked-container">
      {matchState === 'lobby' ? (
        <RankedLobbyPage socket={socket} /> 
      ) : (
        <RankedGamePage socket={socket} />
      )}
    </div>
  );
}

export default RankedManager;