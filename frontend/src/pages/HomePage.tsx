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
    <PageContainer className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto w-full min-w-0 break-words">
      <Heading className="w-full break-words text-center">{t("home.dle")} {universe === 'country' ? t("home.countryMode") : t("home.leagueMode")}</Heading>
      <div className="flex flex-col gap-3 w-full min-w-0">
        <h2 className="text-2xl font-semibold tracking-tight text-center text-white break-words w-full">
          {t("home.howToPlay")}
        </h2>
        <p className="text-lg text-center text-slate-300 break-words w-full">
          {t(universe === 'country' ? "home.countryGoal" : "home.goal")}
        </p>

        <ul className="text-base space-y-3 leading-relaxed text-slate-400 w-full min-w-0 break-words">
          <li className="break-words">{t(universe === 'country' ? "home.validCountry" : "home.validChampion")}</li>
          <li className="break-words">{t(universe === 'country' ? "home.afterCountryTry" : "home.afterTry")}</li>
        </ul>

        <ul className="text-sm text-left space-y-3 bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 text-slate-300 w-full min-w-0 break-words">
          <li className="flex items-start gap-3 w-full min-w-0 break-words">
            <span className="shrink-0">🟩</span>
            <span className="flex-1 min-w-0 break-words">
              <span className="font-medium text-white">{t("home.green")}</span> : {t("home.greenMeaning")}
            </span>
          </li>
          <li className="flex items-start gap-3 w-full min-w-0 break-words">
            <span className="shrink-0">🟨</span>
            <span className="flex-1 min-w-0 break-words">
              <span className="font-medium text-white">{t("home.yellow")}</span> : {t("home.yellowMeaning")}
            </span>
          </li>
          <li className="flex items-start gap-3 w-full min-w-0 break-words">
            <span className="shrink-0">🟥</span>
            <span className="flex-1 min-w-0 break-words">
              <span className="font-medium text-white">{t("home.red")}</span> : {t(universe === 'country' ? "countrydle.redCountryMeaning" : "home.redMeaning")}
            </span>
          </li>
        </ul>
      </div>

      <Button asChild className="text-xl px-6 sm:px-12 py-6 rounded-xl w-full max-w-sm mt-4 font-bold shadow-[0_4px_20px_rgba(37,99,235,0.4)] break-words h-auto min-h-[48px]">
        <Link to={universe === 'country' ? '/countrydle' : '/selectGame'} className="flex items-center justify-center w-full min-w-0 break-words">{t("home.play")}</Link>
      </Button>
    </PageContainer>
  );
}

export default HomePage;
