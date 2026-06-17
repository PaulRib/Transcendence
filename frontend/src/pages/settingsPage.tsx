import { useEffect, useState } from 'react';
import { getMyProfile, updateMyPassword, updateMyProfile } from '../api/users.api';
import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';

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
        setError('Utilisateur non connecte');
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
      setError('Utilisateur non connecte');
      setMessage(null);
      return;
    }
    
    try {
      const updatedUser = await updateMyProfile(token, {
        username: pseudo,
      });
      
      updateCurrentUser(updatedUser);
      setPseudo(updatedUser.username);
      setMessage('Profil mis a jour');
      setError(null);
    } catch {
      setError('Impossible de mettre a jour le profil');
      setMessage(null);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Utilisateur non connecte');
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
      setMessage('Mot de passe mis a jour');
      setError(null);
    } catch {
      setError('Impossible de mettre a jour le mot de passe');
      setMessage(null);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
      alert('Compte supprimé.');
      // Logique API de suppression suivie d'une déconnexion
    }
  };

  return (
    <PageContainer className="settings-page">
      <h1>Paramètres</h1>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <div className="settings-block">
        <h2>Modifier le pseudo</h2>
        <form className="auth-form" onSubmit={handleUpdateProfile}>
          <input 
            type="text" 
            placeholder="Nouveau pseudo" 
            value={pseudo} 
            onChange={(e) => setPseudo(e.target.value)} 
          />
          <button type="submit">Sauvegarder</button>
        </form>
      </div>

      <div className="settings-block">
        <h2>Changer le mot de passe</h2>
        <form className="auth-form" onSubmit={handleUpdatePassword}>
          <input 
            type="password" 
            placeholder="Mot de passe actuel" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Nouveau mot de passe" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <button type="submit">Mettre à jour le mot de passe</button>
        </form>
      </div>

      <div className="settings-block danger-zone">
        <h2>Zone de danger</h2>
        <p>La suppression du compte supprime toutes vos données de façon permanente.</p>
        <button className="delete-btn" onClick={handleDeleteAccount}>Supprimer mon compte</button>
      </div>
    </PageContainer>
  );
}

export default SettingsPage;
