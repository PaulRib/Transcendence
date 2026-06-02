import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { registerUser } from "../api/auth.api";

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isLoading} = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await registerUser({
        username,
        email,
        password,
      });

      setMessage(`Utilisateur ${user.username} créé`);
      setError(null);
    } catch {
      setError("Erreur d'inscription");
      setMessage(null);
    }
  };

  if(isLoading){
    return null;
  }

  if(currentUser) {
    return <Navigate to="/" replace />;
  }

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
      {error && <p>{error}</p>}
    </section>
  );
}

export default RegisterPage;
