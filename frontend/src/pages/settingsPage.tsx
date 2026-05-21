import { useState } from 'react';

function SettingsPage() {
  const [pseudo, setPseudo] = useState('');
  const [icon, setIcon] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profil mis à jour !');
    // Logique API ici
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mot de passe mis à jour !');
    // Logique API ici
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
      alert('Compte supprimé.');
      // Logique API de suppression suivie d'une déconnexion
    }
  };

  return (
    <section className="settings-page">
      <h1>Paramètres</h1>
      
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
    </section>
  );
}

export default SettingsPage;
