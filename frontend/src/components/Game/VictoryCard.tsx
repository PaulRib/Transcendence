import { Button } from "../ui/button";

interface VictoryCardProps {
  guessCount: number;
  onReplay?: () => void;
}

export function VictoryCard({ guessCount, onReplay }: VictoryCardProps) {
  return (
    <div className="w-full max-w-md bg-[#28a745]/20 border-[3px] border-[#28a745] rounded-xl p-6 text-center mb-5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-3">
      <h2 className="text-[#28a745] m-0 text-2xl font-bold">🎉 Victoire ! 🎉</h2>
      <p className="m-0 text-white font-medium">
        Félicitations, vous avez trouvé le champion du jour en {guessCount} essais !
      </p>
      {onReplay && (
        <Button 
          onClick={onReplay} 
          className="mt-2 bg-[#28a745] hover:bg-green-600 text-white uppercase font-bold border-2 border-black rounded shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all"
        >
          Rejouer
        </Button>
      )}
    </div>
  );
}