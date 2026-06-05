interface PlayerScore {
  rank: number;
  username: string;
  score: number;
  avatar?: string;
}

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
    <div className="max-w-[800px] mx-auto my-8 p-8 bg-[#14141e]/85 rounded-xl text-white shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
      <h1 className="text-center font-bold text-2xl mb-2 text-[#f1c40f] uppercase tracking-widest">Classement</h1>
      <p className="text-center text-[#bdc3c7] mb-8 text-base">Les meilleurs joueurs du mode classé</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="bg-[#2a2a35] p-4 text-[#95a5a6] uppercase text-sm font-bold border-b-2 border-[#1a1a24] first:rounded-tl-lg">Rang</th>
              <th className="bg-[#2a2a35] p-4 text-[#95a5a6] uppercase text-sm font-bold border-b-2 border-[#1a1a24]">Joueur</th>
              <th className="bg-[#2a2a35] p-4 text-[#95a5a6] uppercase text-sm font-bold border-b-2 border-[#1a1a24] last:rounded-tr-lg">Score (Elo)</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((player) => (
              <tr key={player.rank} className={getRankRowClass(player.rank)}>
                <td className={getRankCellClass(player.rank)}>
                  {player.rank === 1 && '🥇'}
                  {player.rank === 2 && '🥈'}
                  {player.rank === 3 && '🥉'}
                  {player.rank > 3 && `#${player.rank}`}
                </td>
                <td className="w-full p-4 border-b border-[#2a2a35]">
                  <div className="flex items-center gap-4">
                    <span className="w-9 h-9 bg-[#3b3b4f] rounded-full flex items-center justify-center text-base">👤</span>
                    <span className="font-bold text-lg">{player.username}</span>
                  </div>
                </td>
                <td className="w-[120px] p-4 border-b border-[#2a2a35] font-bold text-[#f1c40f] text-lg">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage;
