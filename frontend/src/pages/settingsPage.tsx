import { useEffect, useState } from 'react';
import { getMyProfile, updateMyPassword, updateMyProfile } from '../api/users.api';
import { generateTwoFactorQrCode, turnOnTwoFactor, turnOffTwoFactor } from '../api/two-factor.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AvatarPicker } from '../components/AvatarPicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useLanguage } from '../i18n/LanguageContext';
import { toast } from 'sonner';

function SettingsPage() {
  const [pseudo, setPseudo] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, updateCurrentUser } = useAuth();
  const { t } = useLanguage();

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);

  const handleOpen2FASetting = async () => {
    setError(null);
    setMessage(null);
    try {
      const data = await generateTwoFactorQrCode();
      setQrCodeDataUrl(data.qrCodeDataUrl);
      setIs2FADialogOpen(true);
    } catch {
      toast.error("Impossible de générer le QR Code 2FA");
    }
  };

  const handleTurnOn2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await turnOnTwoFactor(twoFactorInput);
      toast.success("Authentification à double facteur activée avec succès !");
      setIs2FADialogOpen(false);
      setTwoFactorInput('');
      if (currentUser) {
        updateCurrentUser({ ...currentUser, is_two_factor_enabled: true });
      }
    } catch (err: any) {
      toast.error(err.message || "Code 2FA invalide");
    }
  };

  const handleTurnOff2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await turnOffTwoFactor(twoFactorInput);
      toast.success("Authentification à double facteur désactivée");
      setIsDisableDialogOpen(false);
      setTwoFactorInput('');
      if (currentUser) {
        updateCurrentUser({ ...currentUser, is_two_factor_enabled: false });
      }
    } catch (err: any) {
      toast.error(err.message || "Code 2FA invalide");
    }
  };

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) {
        setError(t("settings.notConnected"));
        return;
      }

      try {
        const user = await getMyProfile();
        setPseudo(user.username);
        setAvatarUrl(user.avatar_url);
        setError(null);
      } catch {
        setError(t("settings.loadProfileError"));
      }
    }
    loadProfile();
  }, [currentUser, t]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error(t("settings.notConnected"));
      setMessage(null);
      return;
    }
    
    try {
      const updatedUser = await updateMyProfile({
        username: pseudo,
        avatar_url: avatarUrl,
      });
      
      updateCurrentUser(updatedUser);
      setPseudo(updatedUser.username);
      toast.success(t("settings.profileUpdated"));
      setError(null);
    } catch {
      toast.error(t("settings.updateProfileError"));
      setMessage(null);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError(t("settings.notConnected"));
      setMessage(null);
      return;
    }

    try {
      await updateMyPassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      toast.success(t("settings.passwordUpdated"));
      setError(null);
    } catch {
      toast.error(t("settings.updatePasswordError"));
      setMessage(null);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 w-full">
        <Heading>{t("settings.title")}</Heading>
        
        {message && <p className="text-emerald-400 font-medium m-0">{message}</p>}
        {error && <p className="text-red-400 font-medium m-0">{error}</p>}

        {/* Profile block: username and avatar */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-8 text-center">
          <form className="flex flex-col items-center gap-8 w-full" onSubmit={handleUpdateProfile}>
            
            {/* Username section */}
            <div className="flex flex-col items-center gap-4 w-full">
              <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2 w-full">{t("settings.username")}</h2>
              <Input 
                type="text" 
                placeholder={t("settings.newUsernamePlaceholder")}
                value={pseudo} 
                onChange={(e) => setPseudo(e.target.value)} 
                className="max-w-md text-center"
              />
            </div>

            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4 w-full">
              <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2 w-full">{t("settings.avatar")}</h2>
              
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24 border-2 border-white/20 shadow-lg">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-3xl text-white">{(pseudo || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">{t("settings.changeAvatar")}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-[#1d1d20] border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>{t("settings.newAvatar")}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <AvatarPicker currentAvatar={avatarUrl} onAvatarChange={setAvatarUrl} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Button type="submit" className="w-fit px-8 mt-4">{t("settings.save")}</Button>
          </form>
        </div>

        {/* Password block */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2 w-full">{t("settings.changePassword")}</h2>
          <form className="flex flex-col items-center gap-3 w-full" onSubmit={handleUpdatePassword}>
            <Input 
              type="password" 
              placeholder={t("settings.currentPasswordPlaceholder")}
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              className="max-w-md text-center"
            />
            <Input 
              type="password" 
              placeholder={t("settings.newPasswordPlaceholder")}
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="max-w-md text-center"
            />
            <Button type="submit">{t("settings.updatePassword")}</Button>
          </form>
        </div>

        {/* Security block: TOTP with Google Authenticator */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2 w-full">Sécurité 2FA (Google Authenticator)</h2>
          <p className="text-sm text-slate-300">
            Protégez votre compte avec un code à 6 chiffres généré par votre application mobile.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentUser?.is_two_factor_enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
              Statut : {currentUser?.is_two_factor_enabled ? 'Activée' : 'Désactivée'}
            </span>

            {!currentUser?.is_two_factor_enabled ? (
              <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                <Button type="button" onClick={handleOpen2FASetting} className="bg-emerald-600 hover:bg-emerald-700">
                  Activer la 2FA
                </Button>
                <DialogContent className="max-w-md bg-[#1d1d20] border-white/10 text-white flex flex-col items-center">
                  <DialogHeader>
                    <DialogTitle className="text-center">Configuration Google Authenticator</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <p className="text-xs text-slate-300 text-center">
                      Scannez ce QR Code avec Google Authenticator ou Authy, puis saisissez le code à 6 chiffres pour valider.
                    </p>
                    {qrCodeDataUrl && (
                      <div className="bg-white p-3 rounded-xl shadow-lg">
                        <img src={qrCodeDataUrl} alt="QR Code 2FA" className="w-48 h-48" />
                      </div>
                    )}
                    <form onSubmit={handleTurnOn2FA} className="flex flex-col items-center gap-3 w-full mt-2">
                      <Input
                        type="text"
                        placeholder="Code à 6 chiffres"
                        maxLength={6}
                        value={twoFactorInput}
                        onChange={(e) => setTwoFactorInput(e.target.value)}
                        className="text-center tracking-widest text-lg font-mono"
                      />
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Confirmer et Activer
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
                <Button type="button" variant="destructive" onClick={() => setIsDisableDialogOpen(true)}>
                  Désactiver la 2FA
                </Button>
                <DialogContent className="max-w-md bg-[#1d1d20] border-white/10 text-white flex flex-col items-center">
                  <DialogHeader>
                    <DialogTitle className="text-center">Désactiver la 2FA</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleTurnOff2FA} className="flex flex-col items-center gap-4 py-4 w-full">
                    <p className="text-sm text-slate-300 text-center">
                      Saisissez votre code actuel pour confirmer la désactivation de l'authentification à double facteur.
                    </p>
                    <Input
                      type="text"
                      placeholder="Code à 6 chiffres"
                      maxLength={6}
                      value={twoFactorInput}
                      onChange={(e) => setTwoFactorInput(e.target.value)}
                      className="text-center tracking-widest text-lg font-mono"
                    />
                    <Button type="submit" variant="destructive" className="w-full">
                      Confirmer la désactivation
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default SettingsPage;
