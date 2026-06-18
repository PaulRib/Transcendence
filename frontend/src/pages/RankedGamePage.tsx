import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface RankedGamePageProps {
  socket: Socket;
  matchId: string;
}

function RankedGamePage({ socket, matchId }: RankedGamePageProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Message de bienvenue local
    setLogs((prev) => [...prev, `✅ Connecté à l'arène du match : ${matchId}`]);

    // Écoute des événements envoyés par ton MultiplayerGateway
    socket.on('guess_result_full', (data) => {
      setLogs((prev) => [...prev, `🎯 Résultat de ton guess : ${data.isWin ? 'Gagné !' : 'Raté...'}`]);
    });

    socket.on('guess_result_spectator', (data) => {
      setLogs((prev) => [...prev, `👀 L'adversaire a joué le champion ID : ${data.championId}`]);
    });

    socket.on('last_chance_triggered', () => {
      setLogs((prev) => [...prev, `⚠️ ATTENTION : L'adversaire a trouvé ! Tu as 1 essai pour égaliser.`]);
    });

    socket.on('game_over', (data) => {
      if (data.isDraw) {
        setLogs((prev) => [...prev, `🏁 FIN : Égalité parfaite !`]);
      } else {
        setLogs((prev) => [...prev, `🏁 FIN : Le vainqueur est ${data.winnerId}`]);
      }
    });

    // Nettoyage pour éviter les doubles écoutes
    return () => {
      socket.off('guess_result_full');
      socket.off('guess_result_spectator');
      socket.off('last_chance_triggered');
      socket.off('game_over');
    };
  }, [socket, matchId]);

  // Fonction pour simuler un "guess" vers ton backend
  const handleTestGuess = () => {
    const dummyChamp = "Ahri"; // Tu peux changer pour tester avec d'autres
    setLogs((prev) => [...prev, `📤 Envoi du guess "${dummyChamp}"...`]);
    socket.emit('submit_guess', { GuessedChamp: dummyChamp, matchId });
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Arène Classée ⚔️</h2>
      
      <div 
        style={{ 
          padding: '20px', 
          border: '2px solid #4CAF50', 
          borderRadius: '8px', 
          margin: '20px auto', 
          maxWidth: '500px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)'
        }}
      >
        <h3>Match ID : {matchId}</h3>
        <p>Si tu vois cet écran, le matchmaking a parfaitement fonctionné !</p>
        
        <button 
          onClick={handleTestGuess}
          style={{ 
            marginTop: '20px', padding: '12px 24px', cursor: 'pointer',
            backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px',
            fontWeight: 'bold', fontSize: '16px'
          }}
        >
          Envoyer un Guess de test
        </button>
      </div>

      <div 
        style={{ 
          marginTop: '30px', textAlign: 'left', maxWidth: '600px', 
          margin: '0 auto', backgroundColor: '#1e1e1e', color: '#00FF00', 
          padding: '15px', borderRadius: '8px', fontFamily: 'monospace',
          height: '250px', overflowY: 'auto'
        }}
      >
        <h4 style={{ color: '#fff', marginTop: 0 }}>Terminal du Match :</h4>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {logs.map((log, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RankedGamePage;