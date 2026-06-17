import { Link} from 'react-router-dom';
import { Button } from "../components/ui/button";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';

function HomePage() {


  return (
    <PageContainer className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      
      <Heading className="mb-8 text-4xl font-extrabold tracking-tight lg:text-5xl">
        42dle
      </Heading>
      
      <div className="w-full space-y-6 text-left mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-center">
          Comment jouer ?
        </h2>
        <p className="text-base text-center">
          Le but est de deviner le champion.
        </p>
        
        <ul className=" text-base space-y-2  leading-7 text-center  ">
          <li>Chaque proposition doit être un champion valide.</li>
          <li>Appuyez sur "Entrée" pour valider votre mot.</li>
          <li>Après chaque essai, vous verrez les caractéristiques du personnage et leur correspondance.</li>
        </ul>
        
        <ul className="text-base space-y-3 bg-muted p-4 ">
          <li>🟩 <strong className="font-medium">Vert</strong> : Si c'est correct</li>
          <li>🟨 <strong className="font-medium">Jaune</strong> : Si c'est incomplet ou qu'il y a une caractéristique en trop.</li>
          <li>🟥 <strong className="font-medium">Rouge</strong> : Si la caractéristique ne correspond pas du tout au personnage.</li>
        </ul>
      </div>
      
        <Button asChild variant="play">
        <Link to="/selectGame">Jouer</Link>
      </Button>
    </PageContainer>
  );
}

export default HomePage;