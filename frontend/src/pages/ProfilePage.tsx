import '../css/ProfilePage.css';
import { useAuth } from '../auth/AuthContext';

function ProfilePage() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!currentUser) {
    return <p>Utilisateur non connecte</p>;
  }

  const avatarUrl = currentUser.avatar_url ??
    'https://www.radiofrance.fr/pikapi/images/837695f1-b7da-48a1-94bf-c4901718432c/1200x680?webp=false';
  const handleChangeIcon = () => {
    alert("Ouverture de la sélection d'avatar (Base de données et Upload local)");
  };

  return (
    <section className="profile-section">
      <h1>Profil Utilisateur</h1>
      
      <div className="profile-avatar-container">
        <img 
          src={avatarUrl} 
          alt={`Icône de ${currentUser.username}`} 
          className="profile-avatar-image"
        />
        <button 
          onClick={handleChangeIcon}
          className="profile-change-icon-btn"
        >
          Changer l'icône
        </button>
      </div>

      <div className="profile-info">
        <h2>{currentUser.username}</h2>
        <p className="profile-points">
          <strong>Points récoltés :</strong> 0
        </p>
      </div>
    </section>
  );
}

export default ProfilePage;
