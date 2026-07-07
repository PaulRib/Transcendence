import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';

function SelectGame() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const gameModes = [
    {
      title: t("selectGame.classicTitle"),
      description: t("selectGame.classicDescription"),
      path: "/classic",
    },
    {
      title: t("selectGame.infiniteTitle"),
      description: t("selectGame.infiniteDescription"),
      path: "/infinite",
    },
    {
      title: t("selectGame.rankedTitle"),
      description: t("selectGame.rankedDescription"),
      path: "/ranked",
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-5xl min-w-0 break-words">
        <Heading className="break-words w-full text-center">{t("selectGame.title")}</Heading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full mt-2 sm:mt-4">
          {gameModes.map((mode) => (
            <div 
              key={mode.path}
              onClick={() => navigate(mode.path)}
              className="group flex flex-col justify-between bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/10 hover:border-blue-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-blue-500/10 text-center h-full min-h-[160px]"
            >
              <div className="flex flex-col gap-3 items-center justify-center h-full">
                <h2 className="text-2xl sm:text-2xl font-bold m-0 group-hover:text-blue-400 transition-colors duration-200 break-words">
                  {mode.title}
                </h2>
                <p className="text-base sm:text-sm text-gray-300/90 leading-relaxed m-0 break-words">
                  {mode.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default SelectGame;