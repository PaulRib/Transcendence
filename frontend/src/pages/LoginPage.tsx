import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, redirectToFortyTwoLogin } from '../api/auth.api';
import { authenticateTwoFactorLogin } from '../api/two-factor.api';
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

  // --- [AJOUT 2FA] --- États pour gérer l'étape de vérification 2FA
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const loginResponse = await loginUser({
        identifier,
        password,
      });

      // --- [AJOUT 2FA] --- Si le serveur indique que le compte a la 2FA activée
      if (loginResponse.requires2FA && loginResponse.userId) {
        setRequires2FA(true);
        setTempUserId(loginResponse.userId);
        setError(null);
        return;
      }

      if (loginResponse.user) {
        login(loginResponse.user);
        navigate('/');
        setError(null);
      }
    } catch {
      setError(t("login.invalidCredentials"));
      setMessage(null);
    }
  };

  // --- [AJOUT 2FA] --- Soumission du code Google Authenticator (6 chiffres)
  const handle2FASubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!tempUserId) return;

    try {
      const result = await authenticateTwoFactorLogin(tempUserId, twoFactorCode);
      login(result.user);
      navigate('/');
      setError(null);
    } catch {
      setError("Code 2FA invalide ou expiré");
    }
  };

  const handle42Login = () => {
    redirectToFortyTwoLogin();
  };

  return (
    <PageContainer>
      <Heading>{requires2FA ? "Vérification 2FA" : t("login.title")}</Heading>

      {/* --- [AJOUT 2FA] --- Formulaire de vérification TOTP */}
      {requires2FA ? (
        <form className="flex flex-col gap-6 w-full max-w-sm mx-auto" onSubmit={handle2FASubmit}>
          <p className="text-center text-slate-300 text-sm">
            Ouvrez votre application Google Authenticator et saisissez le code à 6 chiffres.
          </p>
          <Input
            type="text"
            placeholder="Code à 6 chiffres (ex: 123456)"
            maxLength={6}
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            className="text-center tracking-widest text-lg font-mono"
            autoFocus
          />
          <Button type="submit">Vérifier et me connecter</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setRequires2FA(false)}
            className="border-white/20 text-slate-400"
          >
            Retour
          </Button>
        </form>
      ) : (
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
            {t("login.fortyTwoLogin")}
          </Button>
        </form>
      )}

      {!requires2FA && (
        <div className="flex flex-row items-center justify-center gap-1.5 mt-4 text-slate-300 text-[0.95rem]">
          <span>{t("login.noAccount")}</span>
          <Link to="/register" className="text-blue-300 font-semibold no-underline hover:text-blue-200 hover:underline">
            {t("login.register")}
          </Link>
        </div>
      )}

      {message && <p>{message}</p>}
      {oauthError === 'email_exists' && <FormError>{t("login.oauthEmailExists")}</FormError>}
      <FormError>{error}</FormError>
    </PageContainer>
  );
}

export default LoginPage;
