import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { useLanguage } from '../i18n/LanguageContext';
import { getCurrentUser } from '../api/auth.api';

function FortyTwoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    async function completeFortyTwoLogin(validToken: string) {
      try {
        const user = await getCurrentUser(validToken);

        login(user, validToken);
        navigate('/', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    }

    completeFortyTwoLogin(token);
  }, [login, navigate, searchParams]);

  return (
    <PageContainer>
      <p>{t("login.fortyTwoLoading")}</p>
    </PageContainer>
  );
}

export default FortyTwoCallbackPage;
