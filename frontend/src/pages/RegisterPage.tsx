import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from "../i18n/LanguageContext";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormError } from '../components/ui/form-error';
import { toast } from "sonner";

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
      toast.success(t("register.success").replace("{username}", user.username));
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : t("register.error"));
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
        />
        <Input
          type="email"
          placeholder={t("register.emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          placeholder={t("register.passwordPlaceholder")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit">{t("register.submit")}</Button>
      </form>

      {message && <p>{message}</p>}
      <FormError>{error}</FormError>
    </PageContainer>
  );
}

export default RegisterPage;
