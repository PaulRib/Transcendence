import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

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
    <PageContainer>
      <Heading>Créer un compte</Heading>

      <form className="flex flex-col gap-6 w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit">S'inscrire</Button>
      </form>

      {message && <p>{message}</p>}
      {error && <p className="mt-4 text-red-400 whitespace-pre-line text-sm">{error}</p>}
    </PageContainer>
  );
}

export default RegisterPage;
