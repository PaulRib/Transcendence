import { Link} from 'react-router-dom';
import { Button } from "../components/ui/button";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';

function HomePage() {
  const { t } = useLanguage();

  return (
    <PageContainer className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      
      <Heading className="mb-8 text-4xl font-extrabold tracking-tight lg:text-5xl">
        42dle
      </Heading>
      
      <div className="w-full space-y-6 text-left mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-center">
          {t("home.howToPlay")}
        </h2>
        <p className="text-base text-center">
          {t("home.goal")}
        </p>
        
        <ul className=" text-base space-y-2  leading-7 text-center  ">
          <li>{t("home.validChampion")}</li>
          <li>{t("home.pressEnter")}</li>
          <li>{t("home.afterTry")}</li>
        </ul>
        
        <ul className="text-base space-y-3 bg-muted p-4 ">
          <li>🟩 <strong className="font-medium">{t("home.green")}</strong> : {t("home.greenMeaning")}</li>
          <li>🟨 <strong className="font-medium">{t("home.yellow")}</strong> : {t("home.yellowMeaning")}</li>
          <li>🟥 <strong className="font-medium">{t("home.red")}</strong> : {t("home.redMeaning")}</li>
        </ul>
      </div>
      
        <Button asChild variant="play">
        <Link to="/selectGame">{t("home.play")}</Link>
      </Button>
    </PageContainer>
  );
}

export default HomePage;