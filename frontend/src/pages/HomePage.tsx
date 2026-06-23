import { Link} from 'react-router-dom';
import { Button } from "../components/ui/button";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';

function HomePage() {


  return (
    <PageContainer className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      
      <Heading>42dle</Heading>
      
      <div className="w-full space-y-6 text-left mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-center text-white">
          Comment jouer ?
        </h2>
        <p className="text-lg text-center text-slate-300">
          Le but est de deviner le champion mystère.
        </p>
        
        <ul className="text-base space-y-3 leading-relaxed text-center text-slate-400">
          <li>Chaque proposition doit être un champion valide.</li>
          <li>Appuyez sur "Entrée" pour valider votre mot.</li>
          <li>Après chaque essai, vous verrez les caractéristiques du personnage et leur correspondance.</li>
        </ul>
        
        <ul className="text-sm space-y-3 bg-white/5 border border-white/10 rounded-xl p-6 text-slate-300">
          <li className="flex items-center gap-3">🟩 <span className="font-medium text-white">Vert</span> : La caractéristique est exacte.</li>
          <li className="flex items-center gap-3">🟨 <span className="font-medium text-white">Jaune</span> : Incomplet ou partiellement correct.</li>
          <li className="flex items-center gap-3">🟥 <span className="font-medium text-white">Rouge</span> : Ne correspond pas du tout.</li>
        </ul>
      </div>
      
      <Button asChild className="text-xl px-12 py-6 rounded-xl w-full max-w-sm mt-4 font-bold shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
        <Link to="/selectGame">Jouer</Link>
      </Button>
    </PageContainer>
  );
}

export default HomePage;