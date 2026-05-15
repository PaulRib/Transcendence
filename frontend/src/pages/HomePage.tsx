import { useEffect, useState } from 'react';
import { getBackendHealth } from '../api/health.api';

function HomePage() {
  const [backendStatus, setBackendStatus] = useState<string>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBackendHealth() {
      try {
        const data = await getBackendHealth();
        setBackendStatus(data.status);
      } catch {
        setError('Cannot reach backend');
        setBackendStatus('error');
      }
    }

    fetchBackendHealth();
  }, []);

  return (
    <section>
      <h1>ft_transcendancedle</h1>
      <p>Welcome to the project frontend.</p>

      <section>
        <h2>Backend connection</h2>

        {error ? (
          <p>{error}</p>
        ) : (
          <p>Backend status: {backendStatus}</p>
        )}
      </section>
    </section>
  );
}

export default HomePage;
/* Temp HomePage de test */