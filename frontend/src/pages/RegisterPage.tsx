import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from "../i18n/LanguageContext";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from "sonner";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
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
      toast.success(t("register.success").replace("{username}", user.username));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("register.error"));
      setMessage(null);
    }
  };

  return (
    <PageContainer>
      <Heading>{t("register.title")}</Heading>

      <form className="flex flex-col gap-6 w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder={t("register.usernamePlaceholder")}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          minLength={3}
          maxLength={30}
        />
        <Input
          type="email"
          placeholder={t("register.emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t("register.passwordPlaceholder")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
        <Button type="submit">{t("register.submit")}</Button>
        <div className="text-xs text-slate-400 text-center leading-relaxed px-2 mt-1">
          <Link to="/terms" className="text-blue-400 hover:underline font-medium">{t("nav.termsOfService")}</Link>
          {' • '}
          <Link to="/privacy" className="text-blue-400 hover:underline font-medium">{t("nav.privacyPolicy")}</Link>
        </div>
      </form>

      {message && <p>{message}</p>}
    </PageContainer>
  );
}

export default RegisterPage;
