import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      navigate('/');
      setError(null);
    } catch {
      setError("Identifiant ou mot de passe incorrect(e)");
      setMessage(null);
    }
  };

  return (
    <PageContainer>
      <Heading>Connexion</Heading>

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
      {error && <p className="form-error">{error}</p>}
    </PageContainer>
  );
}

export default LoginPage;
