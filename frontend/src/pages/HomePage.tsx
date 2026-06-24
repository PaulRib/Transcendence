import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';
import { useGameUniverse } from '../context/GameUniverseContext';

function HomePage() {
  const { universe } = useGameUniverse();
  const { t } = useLanguage();

  return (
    <PageContainer className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      <Heading>{t("home.dle")} {universe === 'country' ? t("home.countryMode") : t("home.leagueMode")}</Heading>
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-2xl font-semibold tracking-tight text-center text-white">
          {t("home.howToPlay")}
        </h2>
        <p className="text-lg text-center text-slate-300">
          {t(universe === 'country' ? "home.countryGoal" : "home.goal")}
        </p>

        <ul className="text-base space-y-3 leading-relaxed text-center text-slate-400">
          <li>{t(universe === 'country' ? "home.validCountry" : "home.validChampion")}</li>
          <li>{t(universe === 'country' ? "home.afterCountryTry" : "home.afterTry")}</li>
        </ul>

        <ul className="text-sm space-y-3 bg-white/5 border border-white/10 rounded-xl p-6 text-slate-300">
          <li className="flex items-center gap-3">🟩 <span className="font-medium text-white">{t("home.green")}</span> : {t("home.greenMeaning")}</li>
          <li className="flex items-center gap-3">🟨 <span className="font-medium text-white">{t("home.yellow")}</span> : {t("home.yellowMeaning")}</li>
          <li className="flex items-center gap-3">🟥 <span className="font-medium text-white">{t("home.red")}</span> : {t("home.redMeaning")}</li>
        </ul>
      </div>

      <Button asChild className="text-xl px-12 py-6 rounded-xl w-full max-w-sm mt-4 font-bold shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
        <Link to={universe === 'country' ? '/countrydle' : '/selectGame'}>{t("home.play")}</Link>
      </Button>
    </PageContainer>
  );
}

export default HomePage;
