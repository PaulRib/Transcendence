import { useEffect, useState } from 'react';
import { getMyProfile, updateMyPassword, updateMyProfile } from '../api/users.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

function SettingsPage() {
  const [pseudo, setPseudo] = useState('');
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
      const updatedUser = await updateMyProfile(token, {
        username: pseudo,
      });
      
      updateCurrentUser(updatedUser);
      setPseudo(updatedUser.username);
      setMessage('Profil mis à jour');
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

        {/* Bloc Pseudo */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4 text-left">
          <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2">Modifier le pseudo</h2>
          <form className="flex flex-col gap-3" onSubmit={handleUpdateProfile}>
            <Input 
              type="text" 
              placeholder="Nouveau pseudo" 
              value={pseudo} 
              onChange={(e) => setPseudo(e.target.value)} 
            />
            <Button type="submit" >Sauvegarder</Button>
          </form>
        </div>

        {/* Bloc Mot de passe */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4 text-left">
          <h2 className="text-xl font-semibold m-0 border-b border-white/10 pb-2">Changer le mot de passe</h2>
          <form className="flex flex-col gap-3" onSubmit={handleUpdatePassword}>
            <Input 
              type="password" 
              placeholder="Mot de passe actuel" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
            <Input 
              type="password" 
              placeholder="Nouveau mot de passe" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
            <Button type="submit">Mettre à jour le mot de passe</Button>
          </form>
        </div>

        {/* Zone de danger */}
        <div className="bg-white/5 border border-red-500/50 rounded-xl p-6 flex flex-col gap-4 text-left">
          <h2 className="text-xl font-semibold m-0 text-red-500 border-b border-red-500/20 pb-2">Zone de danger</h2>
          <p className="text-red-400/90 text-sm m-0">La suppression du compte supprime toutes vos données de façon permanente.</p>
          <Button variant="destructive"  onClick={handleDeleteAccount}>
            Supprimer mon compte
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

export default SettingsPage;