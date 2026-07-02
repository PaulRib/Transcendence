import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import RankedLobbyPage from '../pages/RankedLobbyPage';
import RankedGamePage from '../pages/RankedGamePage';
import { useSocialSocket } from '@/context/SocialSocketContext';

function RankedManager() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<'lobby' | 'waiting' | 'playing'>('lobby');
  const [matchId, setMatchId] = useState<string | null>(null);
  const [starterUserId, setStarterUserId] = useState<string | null>(null);
  const [initialMatchData, setInitialMatchData] = useState<any | null>(null);
  const { acceptedGameInvite, clearAcceptedGameInvite } = useSocialSocket();

  useEffect(() => {
    const newSocket = io(`${window.location.origin}/game`, { 
		path: "/ws",
		withCredentials: true
	});
    
    setSocket(newSocket);

    // ÉCOUTE DU SIGNAL DE RECONNEXION AUTOMATIQUE
    newSocket.on('active_match_found', (data: { matchId: string; matchData: any; starterUserId: string | null }) => {
      console.log("Match actif trouvé lors de la connexion, reconnexion...", data.matchId);
      setMatchId(data.matchId);
      setInitialMatchData(data.matchData);
      setStarterUserId(data.starterUserId);
      setMatchState('playing');
      
      newSocket.emit('join_game_room', { matchId: data.matchId });
    });

    // 2. ÉCOUTE DE LA CRÉATION DU MATCH (Matchmaking)
    newSocket.on('match_found', (data: { matchId: string }) => {
      console.log("Match trouvé !", data.matchId);
      setMatchId(data.matchId);
      setMatchState('waiting'); // On affiche un écran de chargement
      
      // On toque immédiatement à la porte de la Room !
      newSocket.emit('join_game_room', { matchId: data.matchId });
    });

    // 3. ÉCOUTE DU FEU VERT TECHNIQUE (Les 2 joueurs sont dans la Room)
    newSocket.on('game_ready', (data?: { starterUserId?: string }) => {
      console.log("Les deux joueurs sont connectés, c'est parti !", data);
      if (data?.starterUserId) {
        setStarterUserId(data.starterUserId);
      }
      setMatchState('playing'); // On affiche le plateau de jeu !
    });

    // 4. (Optionnel mais recommandé) Retour au lobby si l'adversaire fuit
    newSocket.on('game_over', (data) => {
        if (data.reason === 'opponent_disconnected') {
            alert("Victoire par forfait ! Ton adversaire a quitté la partie.");
            setMatchState('lobby');
            setMatchId(null);
            setInitialMatchData(null);
            setStarterUserId(null);
        }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []); // Le tableau vide garantit qu'on ne crée qu'un seul Socket

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
      
      {/* ÉTAPE 1 : Le joueur est dans le menu ou cherche une partie */}
      {matchState === 'lobby' && (
        <RankedLobbyPage socket={socket} />
      )}
      
      {/* ÉTAPE 2 : Transition invisible (le temps que join_game_room se fasse) */}
      {matchState === 'waiting' && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Préparation de l'arène...</h2>
          <div className="loader">Attente de la connexion de l'adversaire...</div>
        </div>
      )}
      
      {/* ÉTAPE 3 : Le jeu commence ! */}
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