import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';

function SelectGame() {
  const navigate = useNavigate();

  const gameModes = [
    {
      title: "Classique",
      description: "Le mode de jeu normal. Devinez le champion avec des indices.",
      path: "/classic",
      cta: "Jouer en Classique"
    },
    {
      title: "Mode Infini",
      description: "Enchaînez les devinettes sans limite de temps.",
      path: "/infinite",
      cta: "Jouer en Infini"
    },
    {
      title: "Mode Classé",
      description: "Affrontez d'autres joueurs et montez dans le classement !",
      path: "/ranked",
      cta: "Jouer en Classé"
    }
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 w-full max-w-5xl">
        <Heading>Sélection du mode de jeu</Heading>
        
        {/* Grille responsive : 1 colonne sur mobile, 3 sur écran moyen/large */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          {gameModes.map((mode) => (
            <div 
              key={mode.path}
              onClick={() => navigate(mode.path)}
              className="group flex flex-col justify-between bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/10 hover:border-blue-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-blue-500/10 text-center h-full"
            >
              <div className="flex flex-col gap-3 items-center">
                <h2 className="text-2xl font-bold m-0 group-hover:text-blue-400 transition-colors duration-200">
                  {mode.title}
                </h2>
                <p className="text-sm text-gray-300/90 leading-relaxed m-0">
                  {mode.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default SelectGame;