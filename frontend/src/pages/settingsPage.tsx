import { useEffect, useState } from 'react';
import { getMyProfile, updateMyPassword, updateMyProfile } from '../api/users.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AvatarPicker } from '../components/AvatarPicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

function SettingsPage() {
  const [pseudo, setPseudo] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('access_token');
  const { updateCurrentUser } = useAuth();

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setError('Utilisateur non connecté');
        return;
      }

      try {
        const user = await getMyProfile(token);
        setPseudo(user.username);
        setAvatarUrl(user.avatar_url);
        setError(null);
      } catch {
        setError('Impossible de charger le profil');
      }
    }
    loadProfile();
  }, [token]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Utilisateur non connecté');
      setMessage(null);
      return;
    }
    
    try {
      // @TODO(Backend): L'objet envoyé au backend contient désormais un champ `avatar_url` (Option B : texte/lien).
      // Si la base de données s'attend à une vraie URL, et que l'utilisateur a uploadé une image (qui est en Base64),
      // il faudra remplacer la validation `@IsUrl()` par `@IsString()` dans le `UpdateProfileDto` du backend.
      // Si vous implémentez l'Option A (Fichier via FormData), modifiez cet appel API pour utiliser FormData.
      const updatedUser = await updateMyProfile(token, {
        username: pseudo,
        avatar_url: avatarUrl,
      });
      
      updateCurrentUser(updatedUser);
      setPseudo(updatedUser.username);
      setAvatarUrl(updatedUser.avatar_url);
      setMessage('Profil et Avatar mis à jour');
      setError(null);
    } catch {
      setError('Impossible de mettre à jour le profil');
      setMessage(null);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Utilisateur non connecté');
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
      setMessage('Mot de passe mis à jour');
      setError(null);
    } catch {
      setError('Impossible de mettre à jour le mot de passe');
      setMessage(null);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
      alert('Compte supprimé.');
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 w-full">
        <Heading>Paramètres</Heading>
        
        {message && <p className="text-emerald-400 font-medium m-0">{message}</p>}
        {error && <p className="text-red-400 font-medium m-0">{error}</p>}

        {/* Bloc Profil (Pseudo + Avatar) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-8 text-center">
          <form className="flex flex-col items-center gap-8 w-full" onSubmit={handleUpdateProfile}>
            
            {/* Section Pseudo */}
            <div className="flex flex-col items-center gap-4 w-full">
              <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2 w-full">Pseudo</h2>
              <Input 
                type="text" 
                placeholder="Nouveau pseudo" 
                value={pseudo} 
                onChange={(e) => setPseudo(e.target.value)} 
                className="max-w-md text-center"
              />
            </div>

            {/* Section Avatar */}
            <div className="flex flex-col items-center gap-4 w-full">
              <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2 w-full">Avatar</h2>
              
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24 border-2 border-white/20 shadow-lg">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-3xl text-white">{(pseudo || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">Changer l'avatar</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-[#1d1d20] border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Sélectionner un nouvel avatar</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <AvatarPicker currentAvatar={avatarUrl} onAvatarChange={setAvatarUrl} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Button type="submit" className="w-fit px-8 mt-4">Sauvegarder le profil</Button>
          </form>
        </div>

        {/* Bloc Mot de passe */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2 w-full">Changer le mot de passe</h2>
          <form className="flex flex-col items-center gap-3 w-full" onSubmit={handleUpdatePassword}>
            <Input 
              type="password" 
              placeholder="Mot de passe actuel" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              className="max-w-md text-center"
            />
            <Input 
              type="password" 
              placeholder="Nouveau mot de passe" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="max-w-md text-center"
            />
            <Button type="submit" className="w-fit">Mettre à jour le mot de passe</Button>
          </form>
        </div>

        {/* Zone de danger */}
        <div className="bg-white/5 border border-red-500/50 rounded-xl p-6 flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold m-0 text-red-500 border-b border-red-500/20 pb-2 w-full">Zone de danger</h2>
          <p className="text-red-400/90 text-sm m-0">La suppression du compte supprime toutes vos données de façon permanente.</p>
          <Button variant="destructive" className="w-fit" onClick={handleDeleteAccount}>
            Supprimer mon compte
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

export default SettingsPage;