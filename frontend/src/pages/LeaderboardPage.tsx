import { useEffect, useState } from 'react';
import { Heading } from '../components/ui/heading';
import { getLeaderboard } from '../api/gamification.api';
import type { LeaderboardEntry } from '../api/gamification.api';
import { useLanguage } from '../i18n/LanguageContext';

const getRankRowClass = (rank: number) => {
  const base = "transition-colors duration-200 hover:bg-white/5";
  if (rank === 1) return `${base} bg-gradient-to-r from-[#ffd700]/10 to-transparent border-l-4 border-[#ffd700]`;
  if (rank === 2) return `${base} bg-gradient-to-r from-[#c0c0c0]/10 to-transparent border-l-4 border-[#c0c0c0]`;
  if (rank === 3) return `${base} bg-gradient-to-r from-[#cd7f32]/10 to-transparent border-l-4 border-[#cd7f32]`;
  return base;
};

const getRankCellClass = (rank: number) => {
  const base = "text-xl font-bold w-[80px] p-4 border-b border-[#2a2a35]";
  if (rank === 1) return `${base} text-[#ffd700] drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]`;
  if (rank === 2) return `${base} text-[#c0c0c0] drop-shadow-[0_0_5px_rgba(192,192,192,0.5)]`;
  if (rank === 3) return `${base} text-[#cd7f32] drop-shadow-[0_0_5px_rgba(205,127,50,0.5)]`;
  return base;
};

function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const leaderboard = await getLeaderboard();
        setPlayers(leaderboard);
        setError(null);
      } catch {
        setError(t("leaderboard.loadError"));
      }
    }

    loadLeaderboard();
  }, [t]);

  return (
    <div className="max-w-[800px] mx-auto my-8 p-8 bg-[#14141e]/85 rounded-xl text-white shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
      <Heading className="text-center font-bold text-2xl mb-2 text-[#f1c40f] uppercase tracking-widest">{t("leaderboard.title")}</Heading>
      <p className="text-center text-[#bdc3c7] mb-8 text-base">{t("leaderboard.subtitle")}</p>

      {error && <p className="text-center text-red-400">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="bg-[#2a2a35] p-4 text-[#95a5a6] uppercase text-sm font-bold border-b-2 border-[#1a1a24] first:rounded-tl-lg">{t("leaderboard.rank")}</th>
              <th className="bg-[#2a2a35] p-4 text-[#95a5a6] uppercase text-sm font-bold border-b-2 border-[#1a1a24]">{t("leaderboard.player")}</th>
              <th className="bg-[#2a2a35] p-4 text-[#95a5a6] uppercase text-sm font-bold border-b-2 border-[#1a1a24] last:rounded-tr-lg">{t("leaderboard.score")}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const rank = index + 1;

              return (
                <tr key={player.id} className={getRankRowClass(rank)}>
                  <td className={getRankCellClass(rank)}>
                    {rank === 1 && '🥇'}
                    {rank === 2 && '🥈'}
                    {rank === 3 && '🥉'}
                    {rank > 3 && `#${rank}`}
                  </td>
                  <td className="w-full p-4 border-b border-[#2a2a35]">
                    <div className="flex items-center gap-4">
                      <span className="w-9 h-9 bg-[#3b3b4f] rounded-full flex items-center justify-center text-base">
                        {player.avatar_url ? (
                          <img
                            src={player.avatar_url}
                            alt={player.username}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          player.username.charAt(0).toUpperCase()
                        )}
                      </span>
                      <span className="font-bold text-lg">{player.username}</span>
                    </div>
                  </td>
                  <td className="w-[120px] p-4 border-b border-[#2a2a35] font-bold text-[#f1c40f] text-lg">
                    {player.elo_rating}
                  </td>
                </tr>
              );
            })}

            {!error && players.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-[#bdc3c7]">
                  {t("leaderboard.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default LeaderboardPage;
