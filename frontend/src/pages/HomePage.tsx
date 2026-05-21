import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/selectGame');
  };

  return (
    <section>
      <h1>ft_transcendle</h1>
      
      <div className="rules-container">
        <h2>Comment jouer ?</h2>
        <p>Le but est de deviner le champion .</p>
        <ul className="rules-list">
          <li>Chaque proposition doit être un champion valide.</li>
          <li>Appuyez sur "Entrée" pour valider votre mot.</li>
          <li>Après chaque essai, vous verrez les caracterisque du personnage et leur correspondance</li>
        </ul>
        <ul className="color-legend">
          <li>🟩 <strong>Vert</strong> : Si c'est correct </li>
          <li>🟨 <strong>Jaune</strong> : Si c'est incomplet ou qu'il y a une caractéristique en trop.</li>
          <li>🟥 <strong>Rouge</strong> : Si la caractéristique ne correspond pas du tout au personnage.</li>
        </ul>
      </div>
      
      <div>
        <button onClick={handlePlayClick}>Jouer</button>
      </div>
    </section>
  );
}

export default HomePage;
