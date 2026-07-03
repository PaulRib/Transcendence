import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, redirectToFortyTwoLogin} from '../api/auth.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormError } from '../components/ui/form-error';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const oauthError = searchParams.get('oauthError');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const loginResponse = await loginUser({
        identifier,
        password,
      });
      login(loginResponse.user);
      navigate('/');
      setError(null);
    } catch {
      setError(t("login.invalidCredentials"));
      setMessage(null);
    }
  };

  const handle42Login = () => {
    redirectToFortyTwoLogin();
  }

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

        {/* Séparateur */}
        <div className="flex items-center gap-4 my-1">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-slate-400 text-sm font-medium uppercase">ou</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* Bouton 42 */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={handle42Login}
          className="border-white/20 hover:bg-white/5 hover:text-white flex items-center justify-center gap-3 h-12"
        >
          <div className="bg-white text-black font-extrabold text-xs px-1.5 py-0.5 rounded-sm">42</div>
          Se connecter avec 42
        </Button>
      </form>

      <div className="flex flex-row items-center justify-center gap-1.5 mt-4 text-slate-300 text-[0.95rem]">
        <span>{t("login.noAccount")}</span>
        <Link to="/register" className="text-blue-300 font-semibold no-underline hover:text-blue-200 hover:underline">
          {t("login.register")}
        </Link>
      </div>

      {message && <p>{message}</p>}
      {oauthError === 'email_exists' && <FormError>{t("login.oauthEmailExists")}</FormError>}
      <FormError>{error}</FormError>
    </PageContainer>
  );
}

export default LoginPage;
