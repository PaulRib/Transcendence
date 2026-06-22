import { Button } from "../ui/button";
import { Copy, RotateCw, Trophy, Star, Home, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface VictoryCardProps {
  guessCount: number;
  onReplay?: () => void;
}

export function VictoryCard({ guessCount, onReplay }: VictoryCardProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Système de notation : 3 étoiles pour <=2 essais, 2 pour <=5, 1 sinon.
  const stars = guessCount <= 2 ? 3 : guessCount <= 5 ? 2 : 1;

  const handleShare = () => {
    const text = `🏆 J'ai trouvé le champion du jour en ${guessCount} essai${guessCount > 1 ? 's' : ''} sur 42dle !`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-pop-in w-full max-w-md bg-gradient-to-b from-[#1a2a1a] to-[#0f1710] border border-[#28a745]/50 rounded-2xl p-8 text-center mb-5 shadow-[0_0_30px_rgba(40,167,69,0.3)] flex flex-col items-center justify-center gap-5">
      
      {/* Icône Trophée avec animation et lueur */}
      <div className="relative mt-2">
        <div className="absolute inset-0 bg-[#28a745] blur-2xl opacity-40 rounded-full scale-150"></div>
        <Trophy size={64} className="text-[#4ade80] relative z-10 animate-bounce" />
      </div>

      <h2 className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-transparent bg-clip-text m-0 text-3xl font-extrabold uppercase tracking-widest drop-shadow-lg">
        Victoire !
      </h2>
      
      {/* Étoiles de score */}
      <div className="flex gap-2 text-yellow-400 my-1">
        {[1, 2, 3].map((star) => (
          <Star 
            key={star} 
            size={28} 
            fill={star <= stars ? "currentColor" : "none"} 
            className={star <= stars ? "opacity-100 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "opacity-30"} 
          />
        ))}
      </div>

      <p className="m-0 text-gray-200 text-lg font-medium">
        Champion trouvé en <strong className="text-white text-xl">{guessCount}</strong> essai{guessCount > 1 ? 's' : ''} !
      </p>

      <div className="flex flex-col gap-3 w-full mt-4">
        {/* Première ligne : Actions de fin de partie */}
        <div className="flex gap-3 w-full">
          <Button 
            onClick={handleShare} 
            variant="outline"
            className="flex-1 border-[#28a745]/50 hover:bg-[#28a745]/20 text-[#4ade80] h-12"
          >
            {copied ? 'Copié !' : <><Copy size={18} className="mr-2" /> Partager</>}
          </Button>

          {onReplay && (
            <Button 
              onClick={onReplay} 
              className="flex-1 bg-[#28a745] hover:bg-green-600 text-white font-bold h-12 shadow-[0_4px_15px_rgba(40,167,69,0.4)]"
            >
              <RotateCw size={18} className="mr-2" /> Rejouer
            </Button>
          )}
        </div>

        {/* Deuxième ligne : Navigation */}
        <div className="flex gap-3 w-full">
          <Button 
            onClick={() => navigate('/')} 
            variant="secondary"
            className="flex-1 h-12"
          >
            <Home size={18} className="mr-2" /> Menu
          </Button>

          <Button 
            onClick={() => navigate('/selectGame')} 
            variant="secondary"
            className="flex-1 h-12"
          >
            <Gamepad2 size={18} className="mr-2" /> Autres modes
          </Button>
        </div>
      </div>
    </div>
  );
}