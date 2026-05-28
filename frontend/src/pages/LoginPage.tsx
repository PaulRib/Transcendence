import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../auth/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const loginResponse = await loginUser({
        identifier,
        password,
      });
      login(loginResponse.user, loginResponse.access_token);
      setMessage(`Connecté en tant que ${loginResponse.user.username}`);
      setError(null);
    } catch {
      setError("Identifiant ou mot de passe incorrect(e)");
      setMessage(null);
    }
  };

  return (
    <section>
      <h1>Connexion</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur / email"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Connexion</button>
      </form>

      <div className="register-prompt">
        <span>Vous n'avez pas de compte ?</span>
        <Link to="/register" className="auth-secondary-link">
          Inscrivez-vous
        </Link>
      </div>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </section>
  );
}

export default LoginPage;
