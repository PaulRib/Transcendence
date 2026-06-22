import { useEffect, useState } from 'react';
import { getMyProfile, updateMyPassword, updateMyProfile } from '../api/users.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';

function SettingsPage() {
  const [pseudo, setPseudo] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('access_token');
  const { updateCurrentUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setError(t("settings.notConnected"));
        return;
      }

      try {
        const user = await getMyProfile(token);
        setPseudo(user.username);
        setError(null);
      } catch {
        setError(t("settings.loadProfileError"));
      }
    }
    loadProfile();
  }, [token]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError(t("settings.notConnected"));
      setMessage(null);
      return;
    }
    
    try {
      const updatedUser = await updateMyProfile(token, {
        username: pseudo,
      });
      
      updateCurrentUser(updatedUser);
      setPseudo(updatedUser.username);
      setMessage(t("settings.profileUpdated"));
      setError(null);
    } catch {
      setError(t("settings.updateProfileError"));
      setMessage(null);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError(t("settings.notConnected"));
      setMessage(null);
      return;
    }

    try {
      await updateMyPassword(token, {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setMessage(t("settings.passwordUpdated"));
      setError(null);
    } catch {
      setError(t("settings.updatePasswordError"));
      setMessage(null);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t("settings.deleteConfirm"))) {
      alert(t("settings.accountDeleted"));
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 w-full">
        <Heading>{t("settings.title")}</Heading>
        
        {message && <p className="text-emerald-400 font-medium m-0">{message}</p>}
        {error && <p className="text-red-400 font-medium m-0">{error}</p>}

        {/* Bloc Pseudo */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4 text-left">
          <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2">{t("settings.editUsername")}</h2>
          <form className="flex flex-col gap-3" onSubmit={handleUpdateProfile}>
            <Input 
              type="text" 
              placeholder={t("settings.newUsernamePlaceholder")}
              value={pseudo} 
              onChange={(e) => setPseudo(e.target.value)} 
            />
            <Button type="submit" >{t("settings.save")}</Button>
          </form>
        </div>

        {/* Bloc Mot de passe */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4 text-left">
          <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2">{t("settings.changePassword")}</h2>
          <form className="flex flex-col gap-3" onSubmit={handleUpdatePassword}>
            <Input 
              type="password" 
              placeholder={t("settings.currentPasswordPlaceholder")}
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
            <Input 
              type="password" 
              placeholder={t("settings.newPasswordPlaceholder")}
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
            <Button type="submit">{t("settings.updatePassword")}</Button>
          </form>
        </div>

        {/* Zone de danger */}
        <div className="bg-white/5 border border-red-500/50 rounded-xl p-6 flex flex-col gap-4 text-left">
          <h2 className="text-xl font-semibold m-0 text-red-500 border-b border-red-500/20 pb-2">{t("settings.dangerZone")}</h2>
          <p className="text-red-400/90 text-sm m-0">{t("settings.dangerDescription")}</p>
          <Button variant="destructive"  onClick={handleDeleteAccount}>
            {t("settings.deleteAccount")}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

export default SettingsPage;