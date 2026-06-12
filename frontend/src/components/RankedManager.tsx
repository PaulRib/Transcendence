// RankedManager.tsx (Le chef d'orchestre)
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import RankedLobbyPage from '../pages/RankedLobbyPage';
import RankedGamePage from '../pages/RankedGamePage';

function RankedManager() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<'lobby' | 'playing'>('lobby');

  useEffect(() => {
    // 1. On ouvre le socket UNIQUEMENT quand on arrive dans la section Ranked
    const token = localStorage.getItem('jwt_token'); // ou ta méthode de stockage
    const newSocket = io("http://localhost:3000/game", {
      auth: { token }
    });

    setSocket(newSocket);

    // 2. On écoute le signal du serveur qui dit "La partie commence !"
    newSocket.on('match_started', () => {
      setMatchState('playing'); // Cela va déclencher le changement d'affichage
    });

    // 3. Cleanup : On ferme le socket UNIQUEMENT quand le joueur quitte totalement le mode Ranked
    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) return <div>Connexion au serveur en cours...</div>;

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