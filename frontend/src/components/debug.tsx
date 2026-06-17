import { useEffect, useState } from 'react';
import { getBackendHealth } from '../api/health.api';
import { getChampionNames} from '../api/champions.api';
import type { ChampionName } from '../api/type.api';
import { getDailyChamp } from '../api/dailygame.api';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';

import './debug.css';

export default function Debug() {
  const [dailyChampionName, setDailyChampionName] = useState<string>('');
  const [championNames, setChampionNames] = useState<ChampionName[]>([]);
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


  return(
    <div className="debug-page">
      <Heading>Debug Info</Heading>
      
      <PageContainer>
        <h2>Backend connection</h2>
        <div className="backend-status-container">
          <div 
            className={`status-indicator ${backendStatus === 'loading' ? 'loading' : (backendStatus === 'error' || error ? 'error' : 'success')}`}
          />
          {error ? (
            <p>{error}</p>
          ) : (
            <p>Backend status: {backendStatus}</p>
          )}
        </div>
      </PageContainer>

      <PageContainer>
        <h2>Champion of the day</h2>
        <p>{dailyChampionName || 'Loading...'}</p>
      </PageContainer>

      <PageContainer>
        <h2>Champions Loaded</h2>
        <p>{championNames.length > 0 ? `${championNames.length} champions retrieved` : 'Loading...'}</p>
      </PageContainer>
    </div>
  );
}
