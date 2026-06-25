import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { API_BASE_URL } from '../config/api';

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

      <form className="flex flex-col gap-6 w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder={t("login.identifierPlaceholder")}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />
        <Input
          type="password"
          placeholder={t("login.passwordPlaceholder")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit">{t("login.submit")}</Button>
        <Button type="button" variant="outline" onClick={() => window.location.href = `${API_BASE_URL}/auth/42`}>
          Login 42
        </Button>
      </form>

      <div className="flex flex-row items-center justify-center gap-1.5 mt-4 text-slate-300 text-[0.95rem]">
        <span>{t("login.noAccount")}</span>
        <Link to="/register" className="text-blue-300 font-semibold no-underline hover:text-blue-200 hover:underline">
          {t("login.register")}
        </Link>
      </div>

      {message && <p>{message}</p>}
      {error && <p className="mt-4 text-red-400 whitespace-pre-line text-sm">{error}</p>}
    </PageContainer>
  );
}

export default LoginPage;
