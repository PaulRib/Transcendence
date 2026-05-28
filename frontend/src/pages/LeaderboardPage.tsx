import '../css/LeaderboardPage.css';

interface PlayerScore {
  rank: number;
  username: string;
  score: number;
  avatar?: string;
}

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
    <div className="leaderboard-container">
      <h1>Classement Mondial</h1>
      <p className="leaderboard-subtitle">Les meilleurs joueurs du mode classé</p>

      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Joueur</th>
              <th>Score (Elo)</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((player) => (
              <tr key={player.rank} className={`rank-row rank-${player.rank}`}>
                <td className="rank-cell">
                  {player.rank === 1 && '🥇'}
                  {player.rank === 2 && '🥈'}
                  {player.rank === 3 && '🥉'}
                  {player.rank > 3 && `#${player.rank}`}
                </td>
                <td className="player-cell">
                  <div className="player-info">
                    <span className="avatar-placeholder">👤</span>
                    <span className="player-name">{player.username}</span>
                  </div>
                </td>
                <td className="score-cell">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage;
