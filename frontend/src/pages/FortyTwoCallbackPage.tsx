import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { useLanguage } from '../i18n/LanguageContext';

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
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const avatarUrl = searchParams.get('avatarUrl');

    if (!token || !userId || !username) {
      navigate('/login', { replace: true });
      return;
    }

    login(
      {
        id: userId,
        username,
        avatar_url: avatarUrl || null,
      },
      token,
    );

    navigate('/', { replace: true });
  }, [login, navigate, searchParams]);

  return (
    <PageContainer>
      <p>{t("login.fortyTwoLoading")}</p>
    </PageContainer>
  );
}

export default FortyTwoCallbackPage;
