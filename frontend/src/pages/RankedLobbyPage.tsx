import { Socket } from 'socket.io-client';

interface RankedLobbyPageProps {
  socket: Socket | null;
}

function RankedLobbyPage({ socket }: RankedLobbyPageProps) {
  
  // Placeholders pour les futures fonctions d'invitation
  const handleInviteFriend = () => {
    console.log("Ouvrir la modale d'invitation d'un ami");
  };

  return (
    <div className="lobby-container" style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Mode Classé (1v1) - Lobby</h2>
      <p>Défiez vos amis dans un duel classé !</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        
        {/* Section Envoyer une invitation */}
        <div 
          className="lobby-card" 
          style={{ 
            padding: '30px', 
            border: '2px dashed #4CAF50', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            flex: '1',
            maxWidth: '400px'
          }}
        >
          <h3>Lancer un défi</h3>
          <p>Invitez un joueur connecté pour démarrer un match.</p>
          <button 
            onClick={handleInviteFriend}
            className="submit-btn valid" 
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Inviter un joueur
          </button>
        </div>

        {/* Section Recevoir une invitation */}
        <div 
          className="lobby-card" 
          style={{ 
            padding: '30px', 
            border: '2px dashed #2196F3', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            flex: '1',
            maxWidth: '400px'
          }}
        >
          <h3>Invitations reçues</h3>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong>xX_Slayer_Xx</strong> vous a défié !</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => handleAcceptInvite('mock_id')}
                style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Accepter
              </button>
              <button 
                style={{ padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Refuser
              </button>
            </div>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '50px', color: '#888', fontStyle: 'italic', fontSize: '14px' }}>
        <p>⚠️ Page de placeholder pour les invitations 1v1.</p>
        <p>Le socket Ranked ne se connectera qu'une fois qu'une invitation sera acceptée et le <code>matchId</code> généré.</p>
      </div>
    </div>
  );
}

export default RankedLobbyPage;