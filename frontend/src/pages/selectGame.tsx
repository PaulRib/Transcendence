import { useNavigate } from 'react-router-dom';

import { PageContainer } from '../components/ui/page-content';

function SelectGame() {
  const navigate = useNavigate();

  return (
    <PageContainer className="select-game-container">
      <h1>Sélection du mode de jeu</h1>
      
      <div className="game-modes">
        <div className="game-mode-card" onClick={() => navigate('/classic')}>
          <h2>Classique</h2>
          <p>Le mode de jeu normal. Devinez le champion avec des indices.</p>
          <button>Jouer en Classique</button>
        </div>

        <div className="game-mode-card" onClick={() => navigate('/infinite')}>
          <h2>Mode Infini</h2>
          <p>Enchaînez les devinettes sans limite de temps.</p>
          <button>Jouer en Infini</button>
        </div>

        <div className="game-mode-card" onClick={() => navigate('/ranked')}>
          <h2>Mode Classé</h2>
          <p>Affrontez d'autres joueurs et montez dans le classement !</p>
          <button>Jouer en Classé</button>
        </div>
      </div>
    </PageContainer>
  );
}

export default SelectGame;
