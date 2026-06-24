import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { getMyGamificationStats } from '../api/gamification.api';
import type { GamificationStats } from '../api/gamification.api';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/button';


function ProfilePage() {
  const { currentUser, isLoading } = useAuth();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadStats() {
      const token = localStorage.getItem('access_token');

      if (!token) {
        return;
      }

      try {
        const userStats = await getMyGamificationStats(token);
        setStats(userStats);
      } catch {
        setStats(null);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return <p>{t("profile.loading")}</p>;
  }

  if (!currentUser) {
    return <p>{t("profile.notConnected")}</p>;
  }

  const avatarUrl = currentUser.avatar_url ??
    'https://www.radiofrance.fr/pikapi/images/837695f1-b7da-48a1-94bf-c4901718432c/1200x680?webp=false';

  const handleChangeIcon = () => {
    alert(t("profile.avatarPickerAlert"));
  };

  const badges = [
    {
      name: t("profile.apprenticeName"),
      description: t("profile.apprenticeDescription"),
      unlocked: (stats?.level ?? 1) >= 2,
    },
    {
      name: t("profile.regularName"),
      description: t("profile.regularDescription"),
      unlocked: (stats?.streak_count ?? 0) >= 2,
    },
    {
      name: t("profile.collectorName"),
      description: t("profile.collectorDescription"),
      unlocked: (stats?.points_earned ?? 0) >= 100,
    },
    {
      name: t("profile.expertName"),
      description: t("profile.expertDescription"),
      unlocked: (stats?.level ?? 1) >= 5,
    },
  ];

  return (
    <PageContainer>
      <Heading>{currentUser.username}</Heading>

      <div className="flex flex-col items-center gap-4">
        <img
          src={avatarUrl}
          alt={t("profile.avatarAlt").replace("{username}", currentUser.username)}
          className="w-[150px] h-[150px] rounded-full border-[3px] border-[#ccc] object-cover"
        />
        <Button
          onClick={handleChangeIcon}
        >
          {t("profile.changeIcon")}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-[1.2rem] mt-2">
          <strong>{t("profile.points")}</strong> {stats?.points_earned ?? 0}
        </p>
        <p className="text-[1.2rem] mt-2">
          <strong>{t("profile.xp")}</strong> {stats?.xp_points ?? 0}
        </p>
        <p className="text-[1.2rem] mt-2">
          <strong>{t("profile.streak")}</strong> {stats?.streak_count ?? 0} {t("profile.days")}
        </p>
        <button
          onClick={() => setShowBadges(!showBadges)}
          className="mt-4 px-4 py-2 cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200"
        >
          {showBadges ? t("profile.hideBadges") : t("profile.showBadges")}
        </button>
        {showBadges && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  badge.unlocked
                    ? 'border-[#f1c40f] bg-[#f1c40f]/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                <p className="m-0 font-bold">{badge.name}</p>
                <p className="m-0 mt-1 text-sm">{badge.description}</p>
                <p className="m-0 mt-2 text-xs">
                  {badge.unlocked ? t("profile.unlocked") : t("profile.locked")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default ProfilePage;
