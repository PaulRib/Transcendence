import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, Lock, Database, UserCheck, Mail, ArrowLeft, FileText } from 'lucide-react';

export function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <PageContainer className="max-w-[860px] text-left p-6 sm:p-8 md:p-10 mx-auto my-4 bg-[#1d1d20]/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-2xl">
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-white/10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
            <ShieldCheck size={26} />
          </div>
          <div>
            <Heading className="mb-0 text-3xl sm:text-4xl">{t("privacy.title")}</Heading>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">{t("privacy.lastUpdated")}</p>
          </div>
        </div>
        <Button asChild variant="outline" className="border-white/20 hover:bg-white/10 text-slate-200">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            {t("notFound.button")}
          </Link>
        </Button>
      </div>

      <div className="space-y-6 text-slate-300 w-full leading-relaxed">
        {/* Section 1: Introduction */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-2.5 text-white font-bold text-lg sm:text-xl">
            <FileText size={20} className="text-blue-400 shrink-0" />
            <h2>{t("privacy.introTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            {t("privacy.introText")}
          </p>
        </section>

        {/* Section 2: Data Collected */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-lg sm:text-xl">
            <Database size={20} className="text-indigo-400 shrink-0" />
            <h2>{t("privacy.dataCollectedTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 mb-4">
            {t("privacy.dataCollectedText")}
          </p>
          <ul className="space-y-3 pl-2 text-sm sm:text-base">
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
              <span>{t("privacy.dataAccountItem")}</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
              <span>{t("privacy.dataProfileItem")}</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
              <span>{t("privacy.dataOauthItem")}</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
              <span>{t("privacy.dataGameItem")}</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
              <span>{t("privacy.dataSecurityItem")}</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Use of Data */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-lg sm:text-xl">
            <UserCheck size={20} className="text-emerald-400 shrink-0" />
            <h2>{t("privacy.useOfDataTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 mb-3">
            {t("privacy.useOfDataText")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-300 pl-2">
            <li>{t("privacy.useItem1")}</li>
            <li>{t("privacy.useItem2")}</li>
            <li>{t("privacy.useItem3")}</li>
            <li>{t("privacy.useItem4")}</li>
          </ul>
        </section>

        {/* Section 4: Storage and Security */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-2.5 text-white font-bold text-lg sm:text-xl">
            <Lock size={20} className="text-amber-400 shrink-0" />
            <h2>{t("privacy.storageTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            {t("privacy.storageText")}
          </p>
        </section>

        {/* Section 5: Your Rights */}
        <section className="bg-black/30 p-5 rounded-xl border border-white/10 transition-all hover:border-white/20">
          <div className="flex items-center gap-2.5 mb-3 text-white font-bold text-lg sm:text-xl">
            <ShieldCheck size={20} className="text-purple-400 shrink-0" />
            <h2>{t("privacy.rightsTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 mb-3">
            {t("privacy.rightsText")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/5 p-3.5 rounded-lg border border-white/5">
              <p className="text-sm text-slate-300">{t("privacy.rightsItem1")}</p>
            </div>
            <div className="bg-white/5 p-3.5 rounded-lg border border-white/5">
              <p className="text-sm text-slate-300">{t("privacy.rightsItem2")}</p>
            </div>
            <div className="bg-white/5 p-3.5 rounded-lg border border-white/5">
              <p className="text-sm text-slate-300">{t("privacy.rightsItem3")}</p>
            </div>
          </div>
        </section>

        {/* Section 6: Contact */}
        <section className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-5 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-2.5 mb-2 text-white font-bold text-lg sm:text-xl">
            <Mail size={20} className="text-blue-400 shrink-0" />
            <h2>{t("privacy.contactTitle")}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            {t("privacy.contactText")}
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs sm:text-sm text-slate-400 flex-wrap gap-4">
        <span>© 2026 ft_transcendence / 42dle — 42 School Project</span>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-white transition-colors underline underline-offset-4">
            {t("nav.termsOfService")}
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default PrivacyPolicyPage;
