import { useEffect, useState } from 'react';
import { getBackendHealth } from '../api/health.api';
import { getChampionNames, type ChampionName } from '../api/champions.api';
import { getDailyChamp } from '../api/dailychampion.api';

function GamePage() {
  const [dailyChampionName, setDailyChampionName] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<string>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBackendHealth() {
      try {
        const data = await getBackendHealth();
        setBackendStatus(data.status);
        const names = await getChampionNames();
        setChampionNames(names);
        const dailyChampion = await getDailyChamp();
        setDailyChampionName(dailyChampion.name);
      } catch {
        setError('Cannot reach backend');
        setBackendStatus('error');
      }
    }
    fetchBackendHealth();
  }, []);

  return (
    <section>

      <section>
        <h2>Champion selector</h2>

       <select
          value={(selectedChampion)}
          onChange={(event) => setSelectedChampion(event.target.value)}
          >
            <option value="">Choose a champion</option>

            {championNames.map((champion) => (
              <option key={champion.name} value={champion.name}>
                {champion.name}
              </option>
            ))}
          </select>
        {selectedChampion && (
          <p>Selected champion: {selectedChampion}</p>
        )}
      </section>
    </section>
  );
}
export default GamePage;