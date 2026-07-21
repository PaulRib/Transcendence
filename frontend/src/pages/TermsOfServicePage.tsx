import { Link } from 'react-router-dom';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';
import { FileText, Scale, UserCheck, AlertTriangle, Copyright, BookOpen} from 'lucide-react';

export function TermsOfServicePage() {
  const { t } = useLanguage();

  return (
    <PageContainer className="max-w-[860px] text-left p-6 sm:p-8 md:p-10 mx-auto my-4 bg-[#1d1d20]/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-2xl">
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-white/10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <Scale size={26} />
          </div>
          <div>
            <Heading className="mb-0 text-3xl sm:text-4xl">{t("terms.title")}</Heading>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">{t("terms.lastUpdated")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-slate-300 w-full leading-relaxed">
        {/* Section 1: Acceptance of Terms */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-2.5 text-white font-bold text-lg sm:text-xl">
            <FileText size={20} className="text-purple-400 shrink-0" />
            <h2>{t("terms.introTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            {t("terms.introText")}
          </p>
        </section>

        {/* Section 2: Account Responsibilities */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-lg sm:text-xl">
            <UserCheck size={20} className="text-blue-400 shrink-0" />
            <h2>{t("terms.accountTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 mb-3">
            {t("terms.accountText")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-300 pl-2">
            <li>{t("terms.accountItem1")}</li>
            <li>{t("terms.accountItem2")}</li>
            <li>{t("terms.accountItem3")}</li>
          </ul>
        </section>

        {/* Section 3: Code of Conduct & Fair Play */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-lg sm:text-xl">
            <Scale size={20} className="text-emerald-400 shrink-0" />
            <h2>{t("terms.conductTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 mb-4">
            {t("terms.conductText")}
          </p>
          <div className="space-y-3">
            <div className="bg-white/5 p-3.5 rounded-lg border border-white/5">
              <p className="text-sm sm:text-base text-slate-300">{t("terms.conductItem1")}</p>
            </div>
            <div className="bg-white/5 p-3.5 rounded-lg border border-white/5">
              <p className="text-sm sm:text-base text-slate-300">{t("terms.conductItem2")}</p>
            </div>
            <div className="bg-white/5 p-3.5 rounded-lg border border-white/5">
              <p className="text-sm sm:text-base text-slate-300">{t("terms.conductItem3")}</p>
            </div>
          </div>
        </section>

        {/* Section 4: Intellectual Property */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-2.5 text-white font-bold text-lg sm:text-xl">
            <Copyright size={20} className="text-amber-400 shrink-0" />
            <h2>{t("terms.ipTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            {t("terms.ipText")}
          </p>
        </section>

        {/* Section 5: Termination */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-2.5 text-white font-bold text-lg sm:text-xl">
            <AlertTriangle size={20} className="text-red-400 shrink-0" />
            <h2>{t("terms.terminationTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            {t("terms.terminationText")}
          </p>
        </section>

        {/* Section 6: Modifications */}
        <section className="bg-gradient-to-r from-purple-900/30 to-slate-900/30 p-5 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2.5 mb-2 text-white font-bold text-lg sm:text-xl">
            <BookOpen size={20} className="text-purple-400 shrink-0" />
            <h2>{t("terms.modificationsTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            {t("terms.modificationsText")}
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs sm:text-sm text-slate-400 flex-wrap gap-4">
        <span>© 2026 ft_transcendence / 42dle — 42 School Project</span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-white transition-colors underline underline-offset-4">
            {t("nav.privacyPolicy")}
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default TermsOfServicePage;
