import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { useLanguage } from '../i18n/LanguageContext';
import { getCurrentUser } from '../api/auth.api';

function FortyTwoCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

    async function completeFortyTwoLogin() {
      try {
        const user = await getCurrentUser();

        login(user);
        navigate('/', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    }

    completeFortyTwoLogin();
  }, [login, navigate]);

  return (
    <PageContainer>
      <p>{t("login.fortyTwoLoading")}</p>
    </PageContainer>
  );
}

export default FortyTwoCallbackPage;
