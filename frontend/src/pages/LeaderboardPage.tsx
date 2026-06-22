import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
import { Trophy, Medal, User } from 'lucide-react';

interface PlayerScore {
  rank: number;
  username: string;
  score: number;
  avatar?: string;
}

const getRankRowClass = (rank: number) => {
  const base = "transition-colors duration-200 hover:bg-white/5";
  if (rank === 1) return `${base} bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-500`;
  if (rank === 2) return `${base} bg-gradient-to-r from-slate-400/10 to-transparent border-l-4 border-slate-400`;
  if (rank === 3) return `${base} bg-gradient-to-r from-amber-600/10 to-transparent border-l-4 border-amber-600`;
  return `${base} border-l-4 border-transparent`;
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" size={24} />;
  if (rank === 2) return <Medal className="text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]" size={24} />;
  if (rank === 3) return <Medal className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" size={24} />;
  return <span className="text-slate-500 font-bold ml-1">#{rank}</span>;
};

const mockLeaderboard: PlayerScore[] = [
  { rank: 1, username: 'Faker', score: 2540 },
  { rank: 2, username: 'Chovy', score: 2310 },
  { rank: 3, username: 'ShowMaker', score: 2200 },
  { rank: 4, username: 'Rookie', score: 2150 },
  { rank: 5, username: 'Scout', score: 2050 },
  { rank: 6, username: 'Doinb', score: 1980 },
  { rank: 7, username: 'Knight', score: 1920 },
  { rank: 8, username: 'Xiaohu', score: 1850 },
  { rank: 9, username: 'Caps', score: 1800 },
  { rank: 10, username: 'Perkz', score: 1750 },
];

function LeaderboardPage() {
  return (
    <PageContainer>
      <div className="text-center mb-8 uppercase tracking-widest">
        <Heading className="mb-2">Classement</Heading>
        <p className="text-slate-400 text-base normal-case tracking-normal">Les meilleurs joueurs du mode classé</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-slate-400 uppercase text-xs font-bold tracking-wider">Rang</th>
                <th className="p-4 text-slate-400 uppercase text-xs font-bold tracking-wider">Joueur</th>
                <th className="p-4 text-slate-400 uppercase text-xs font-bold tracking-wider text-right">Score (Elo)</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((player) => (
                <tr key={player.rank} className={getRankRowClass(player.rank)}>
                  <td className="w-[80px] p-4 border-b border-white/5">
                    <div className="flex justify-center items-center h-full">
                      {getRankIcon(player.rank)}
                    </div>
                  </td>
                  <td className="w-full p-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-white/10">
                        <User className="text-slate-400" size={20} />
                      </div>
                      <span className="font-bold text-lg text-slate-100">{player.username}</span>
                    </div>
                  </td>
                  <td className="w-[120px] p-4 border-b border-white/5 font-bold text-right text-lg text-blue-400">
                    {player.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}

export default LeaderboardPage;
