import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { getMyGamificationStats } from '../api/gamification.api';
import type { GamificationStats } from '../api/gamification.api';
import { useLanguage } from '../i18n/LanguageContext';
import apprenticeBadge from '../assets/badges/lvl-badge.png';
import streakBadge from '../assets/badges/streak-badge.png';
import expertStreakBadge from '../assets/badges/expertStreak-badge.png';
import expertBadge from '../assets/badges/expert-badge.png';
import firstBloodBadge from '../assets/badges/firstBlood-badge.png';
import riftConquerorBadge from '../assets/badges/riftConqueror-badge.png';

import { Award, CheckCircle2, ChevronDown, LockKeyhole } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';


function ProfilePage() {
  const { currentUser, isLoading } = useAuth();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadStats() {
      if (!currentUser) {
        return;
      }

      try {
        const userStats = await getMyGamificationStats();
        setStats(userStats);
      } catch {
        setStats(null);
      }
    }
    loadStats();
  }, [currentUser]);

  if (isLoading) {
    return <p>{t("profile.loading")}</p>;
  }

  if (!currentUser) {
    return <p>{t("profile.notConnected")}</p>;
  }

  const badges = [
    {
      name: t("profile.apprenticeName"),
      description: t("profile.apprenticeDescription"),
      unlocked: (stats?.level ?? 1) >= 2,
      image: apprenticeBadge,
    },
    {
      name: t("profile.regularName"),
      description: t("profile.regularDescription"),
      unlocked: (stats?.streak_count ?? 0) >= 2,
      image: streakBadge,
    },
    {
		name: t("profile.expertStreakName"),
		description: t("profile.expertStreakDescription"),
		unlocked: (stats?.streak_count ?? 0) >= 5,
		image: expertStreakBadge,
    },
    {
      name: t("profile.expertName"),
      description: t("profile.expertDescription"),
      unlocked: (stats?.level ?? 1) >= 5,
      image: expertBadge,
    },
    {
      name: t("profile.firstBlood"),
      description: t("profile.firstBloodDescription"),
      unlocked: currentUser.ranked_wins >= 1,
      image: firstBloodBadge,
    },
    {
      name:t("profile.riftConqueror"),
      description: t("profile.riftConquerorDescription"),
      unlocked: currentUser.ranked_wins >= 5,
      image: riftConquerorBadge,
    }
  ];
  const unlockedBadgeCount = badges.filter((badge) => badge.unlocked).length;

  const circleRadius = 24;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const xpProgress = ((stats?.xp_points ?? 0) % 100) / 100;
  const circleOffset = circleCircumference - (xpProgress * circleCircumference);

  return (
    <PageContainer>
      <Heading>{currentUser.username}</Heading>

      <div className="my-6 flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">


          <Avatar className="w-[150px] h-[150px] border-[3px] border-white/20 shadow-lg">
            <AvatarImage src={currentUser.avatar_url || undefined} alt={currentUser.username} className="object-cover" />
            <AvatarFallback className="text-5xl bg-slate-800 text-white font-bold">
              {currentUser.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          {/* Badge du niveau et anneau d'XP issu de la version API */}
          <div className="absolute left-1/2 bottom-[-20px] -translate-x-1/2 w-[56px] h-[56px] flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90 drop-shadow-md" width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r={circleRadius}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r={circleRadius}
                fill="none"
                stroke="#f1c40f"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={circleOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="w-[42px] h-[42px] rounded-full bg-[#111827] border border-[#f1c40f]/60 flex items-center justify-center shadow-lg z-10" title={`${stats?.xp_points ?? 0} XP au total`}>
              <span className="text-white font-bold text-lg">
                {stats?.level ?? 1}
              </span>
            </div>
          </div>
        </div>
      </div>
      

      <div className="text-center mt-6">
        <p className="text-[1.2rem] mt-2">
          <strong>Elo: </strong> {currentUser.elo_rating}
        </p>
        <p className="text-[1.2rem] mt-2">
          <strong>{t("profile.xp")}</strong> {stats?.xp_points ?? 0}
        </p>
        <p className="text-[1.2rem] mt-2">
          <strong>{t("profile.streak")}</strong> {stats?.streak_count ?? 0} {t("profile.days")}
        </p>
        <button
          onClick={() => setShowBadges(!showBadges)}
          aria-expanded={showBadges}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 cursor-pointer bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white font-medium transition-colors duration-200"
        >
          <Award size={18} className="text-amber-400" />
          <span>{showBadges ? t("profile.hideBadges") : t("profile.showBadges")}</span>
          <span className="text-xs text-white/60">{unlockedBadgeCount}/{badges.length}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${showBadges ? 'rotate-180' : ''}`}
          />
        </button>
        {showBadges && (
          <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`relative overflow-hidden rounded-lg border p-4 text-center transition-all duration-200 ${
                  badge.unlocked
                    ? 'border-amber-400/70 bg-amber-400/10 text-white shadow-[0_8px_24px_rgba(245,158,11,0.12)]'
                    : 'border-white/10 bg-white/[0.03] text-white/45'
                }`}
              >
                <div className="mb-3 flex h-28 items-center justify-center">
                  {badge.image ? (
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className={`h-28 w-28 object-contain transition-all duration-200 ${
                        badge.unlocked ? '' : 'grayscale opacity-25'
                      }`}
                    />
                  ) : (
                    <Award size={64} strokeWidth={1.25} className={badge.unlocked ? 'text-amber-400' : 'text-white/20'} />
                  )}
                </div>

                <p className="m-0 text-base font-bold">{badge.name}</p>
                <p className="m-0 mt-1 min-h-10 text-sm text-current/75">{badge.description}</p>
                <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${badge.unlocked ? 'text-amber-300' : 'text-white/35'}`}>
                  {badge.unlocked ? <CheckCircle2 size={14} /> : <LockKeyhole size={14} />}
                  <span>{badge.unlocked ? t("profile.unlocked") : t("profile.locked")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default ProfilePage;
