import { useNavigate } from 'react-router-dom';
// 1. Import du composant Bouton de shadcn/ui
import { Button } from "../components/ui/button";

function HomePage() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/selectGame');
  };

  return (
    <section className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight lg:text-5xl">
        42dle
      </h1>
      
      <div className="w-full space-y-6 text-left mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Comment jouer ?
        </h2>
        <p className="text-muted-foreground">
          Le but est de deviner le champion.
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-sm leading-7">
          <li>Chaque proposition doit être un champion valide.</li>
          <li>Appuyez sur "Entrée" pour valider votre mot.</li>
          <li>Après chaque essai, vous verrez les caractéristiques du personnage et leur correspondance.</li>
        </ul>
        
        <ul className="space-y-3 bg-muted p-4 rounded-lg text-sm border">
          <li>🟩 <strong className="font-medium">Vert</strong> : Si c'est correct</li>
          <li>🟨 <strong className="font-medium">Jaune</strong> : Si c'est incomplet ou qu'il y a une caractéristique en trop.</li>
          <li>🟥 <strong className="font-medium">Rouge</strong> : Si la caractéristique ne correspond pas du tout au personnage.</li>
        </ul>
      </div>
      
      {/* 7. Utilisation du composant shadcn/ui au lieu du bouton HTML standard */}
      <Button onClick={handlePlayClick} variant="play">
        Jouer
      </Button>
      
    </section>
  );
}

export default HomePage;