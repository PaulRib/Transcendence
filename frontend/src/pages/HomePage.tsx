import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
};

function HomePage() {
  const [backendStatus, setBackendStatus] = useState<string>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBackendHealth() {
      try {
        const response = await fetch('http://localhost:3000/api/health');

        if (!response.ok) {
          throw new Error('Backend health request failed');
        }

        const data: HealthResponse = await response.json();
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