import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/game');
  };

  return (
    <section>
      <h1>ft_transcendle</h1>
      
      <div className="rules-container">
        <h2>Comment jouer ?</h2>
        <p>Le but est de deviner le mot mystère.</p>
        <ul className="rules-list">
          <li>Chaque proposition doit être un mot valide.</li>
          <li>Appuyez sur "Entrée" pour valider votre mot.</li>
          <li>Après chaque essai, la couleur des lettres changera pour vous indiquer si vous êtes proche de la solution :</li>
        </ul>
        <ul className="color-legend">
          <li>🟩 <strong>Vert</strong> : La lettre est dans le mot et à la <strong>bonne</strong> place.</li>
          <li>🟨 <strong>Jaune</strong> : La lettre est dans le mot, mais à la <strong>mauvaise</strong> place.</li>
          <li>⬛ <strong>Gris</strong> : La lettre n'est <strong>pas</strong> dans le mot.</li>
        </ul>
      </div>
      
      <div>
        <button onClick={handlePlayClick}>Jouer</button>
      </div>
    </section>
  );
}

export default HomePage;
