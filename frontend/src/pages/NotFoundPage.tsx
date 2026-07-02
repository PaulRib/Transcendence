import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';

function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <PageContainer className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center">
      <div className="text-8xl mb-4">🔍</div>
      <Heading className="mb-4">{t("notFound.title")}</Heading>
      <p className="text-lg text-slate-300 mb-8">
        {t("notFound.desc")}
      </p>
      <Button asChild className="text-xl px-12 py-6 rounded-xl w-full max-w-sm font-bold shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
        <Link to="/">{t("notFound.button")}</Link>
      </Button>
    </PageContainer>
  );
}

export default NotFoundPage;
