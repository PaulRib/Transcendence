import { Button } from "../ui/button";

interface VictoryCardProps {
  guessCount: number;
  onReplay?: () => void;
}

export function VictoryCard({ guessCount, onReplay }: VictoryCardProps) {
  return (
    <div className="victory-card">
      <h2 className="victory-title">🎉 Victoire ! 🎉</h2>
      <p>Félicitations, vous avez trouvé le champion du jour en {guessCount} essais !</p>
      {onReplay && (
        <Button variant="success" onClick={onReplay}>
          Rejouer
        </Button>
      )}
    </div>
  );
}