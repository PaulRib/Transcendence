import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await registerUser({
        username,
        email,
        password,
      });
      navigate('/login');
      setMessage(`Utilisateur ${user.username} créé`);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur d'inscription");
      setMessage(null);
    }
  };

  return (
    <section>
      <h1>Créer un compte</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">S'inscrire</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p className="form-error">{error}</p>}
    </section>
  );
}

export default RegisterPage;
