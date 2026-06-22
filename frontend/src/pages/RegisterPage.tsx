import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from "../i18n/LanguageContext";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await registerUser({
        username,
        email,
        password,
      });
      navigate('/login');
      setMessage(t("register.success").replace("{username}", user.username));
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : t("register.error"));
      setMessage(null);
    }
  };

  return (
    <PageContainer>
      <Heading>{t("register.title")}</Heading>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("register.usernamePlaceholder")}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="email"
          placeholder={t("register.emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder={t("register.passwordPlaceholder")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">{t("register.submit")}</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p className="form-error">{error}</p>}
    </PageContainer>
  );
}

export default RegisterPage;
