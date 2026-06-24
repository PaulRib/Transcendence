import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { Button } from "../ui/button";
import { Trophy, Home, Gamepad2, RotateCw, Skull, Award } from "lucide-react";

export interface GameOverCardProps {
  info: { isDraw: boolean; winnerId: string; reason?: string };
  myId: string;
  guessCount: number;
  onReplay: () => void;
}

export function GameOverCard({ info, myId, guessCount, onReplay }: GameOverCardProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isWinner = info.winnerId === myId;
  const isDraw = info.isDraw;

  if (isDraw) {
    return (
      <div className="animate-pop-in w-full max-w-md bg-gradient-to-b from-[#2a271a] to-[#17150f] border border-amber-500/50 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center gap-5">
        <div className="relative mt-2">
          <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-40 rounded-full scale-150"></div>
          <Award size={64} className="text-amber-400 relative z-10 animate-bounce" />
        </div>
        <h2 className="bg-gradient-to-r from-amber-400 to-yellow-500 text-transparent bg-clip-text m-0 text-3xl font-extrabold uppercase tracking-widest drop-shadow-lg">
          {t("multiplayer.drawTitle")}
        </h2>
        <p className="m-0 text-gray-200 text-lg font-medium">
          {t("multiplayer.drawText").replace("{count}", String(guessCount))}
        </p>
        <div className="flex flex-col gap-3 w-full mt-4">
          <Button onClick={onReplay} className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-12">
            <RotateCw size={18} className="mr-2" /> {t("multiplayer.findAnotherMatch")}
          </Button>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} variant="secondary" className="flex-1 h-12">
              <Home size={18} className="mr-2" /> {t("multiplayer.menu")}
            </Button>
            <Button onClick={() => navigate('/selectGame')} variant="secondary" className="flex-1 h-12">
              <Gamepad2 size={18} className="mr-2" /> {t("multiplayer.otherModes")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isWinner) {
    const isForfeit = info.reason === 'opponent_disconnected';
    return (
      <div className="animate-pop-in w-full max-w-md bg-gradient-to-b from-[#1a2a1a] to-[#0f1710] border border-[#28a745]/50 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(40,167,69,0.3)] flex flex-col items-center justify-center gap-5">
        <div className="relative mt-2">
          <div className="absolute inset-0 bg-[#28a745] blur-2xl opacity-40 rounded-full scale-150"></div>
          <Trophy size={64} className="text-[#4ade80] relative z-10 animate-bounce" />
        </div>
        <h2 className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-transparent bg-clip-text m-0 text-3xl font-extrabold uppercase tracking-widest drop-shadow-lg">
          {t("multiplayer.victoryTitle")}
        </h2>
        <p className="m-0 text-gray-200 text-lg font-medium">
          {isForfeit 
            ? t("multiplayer.forfeitText")
            : t("multiplayer.victoryText").replace("{count}", String(guessCount))
          }
        </p>
        <div className="flex flex-col gap-3 w-full mt-4">
          <Button onClick={onReplay} className="bg-[#28a745] hover:bg-green-600 text-white font-bold h-12 shadow-[0_4px_15px_rgba(40,167,69,0.4)]">
            <RotateCw size={18} className="mr-2" /> {t("multiplayer.replayMatchmaking")}
          </Button>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} variant="secondary" className="flex-1 h-12">
              <Home size={18} className="mr-2" /> {t("multiplayer.menu")}
            </Button>
            <Button onClick={() => navigate('/selectGame')} variant="secondary" className="flex-1 h-12">
              <Gamepad2 size={18} className="mr-2" /> {t("multiplayer.otherModes")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pop-in w-full max-w-md bg-gradient-to-b from-[#2a1a1a] to-[#170f0f] border border-red-500/50 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.25)] flex flex-col items-center justify-center gap-5">
      <div className="relative mt-2">
        <div className="absolute inset-0 bg-red-500 blur-2xl opacity-40 rounded-full scale-150"></div>
        <Skull size={64} className="text-red-400 relative z-10 animate-bounce" />
      </div>
      <h2 className="bg-gradient-to-r from-red-400 to-rose-600 text-transparent bg-clip-text m-0 text-3xl font-extrabold uppercase tracking-widest drop-shadow-lg">
        {t("multiplayer.defeatTitle")}
      </h2>
      <p className="m-0 text-gray-200 text-lg font-medium">
        {t("multiplayer.defeatText")}
      </p>
      <div className="flex flex-col gap-3 w-full mt-4">
        <Button onClick={onReplay} className="bg-red-500 hover:bg-red-600 text-white font-bold h-12">
          <RotateCw size={18} className="mr-2" /> {t("multiplayer.replayMatchmaking")}
        </Button>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/')} variant="secondary" className="flex-1 h-12">
            <Home size={18} className="mr-2" /> {t("multiplayer.menu")}
          </Button>
          <Button onClick={() => navigate('/selectGame')} variant="secondary" className="flex-1 h-12">
            <Gamepad2 size={18} className="mr-2" /> {t("multiplayer.otherModes")}
          </Button>
        </div>
      </div>
    </div>
  );
}
