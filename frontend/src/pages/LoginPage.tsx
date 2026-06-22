import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

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
      setError(t("login.invalidCredentials"));
      setMessage(null);
    }
  };

  return (
    <PageContainer>
      <Heading>{t("login.title")}</Heading>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("login.identifierPlaceholder")}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />
        <input
          type="password"
          placeholder={t("login.passwordPlaceholder")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">{t("login.submit")}</button>
      </form>

      <div className="register-prompt">
        <span>{t("login.noAccount")}</span>
        <Link to="/register" className="auth-secondary-link">
          {t("login.register")}
        </Link>
      </div>

      {message && <p>{message}</p>}
      {error && <p className="form-error">{error}</p>}
    </PageContainer>
  );
}

export default LoginPage;
