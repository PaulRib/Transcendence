import '../css/ProfilePage.css';

function ProfilePage() {
  const User = {
    username: "PlayerOne",
    points: 42,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PlayerOne" // Image "placeholder" générée
  };

  const handleChangeIcon = () => {
    alert("Ouverture de la sélection d'avatar (Base de données et Upload local)");
  };

  return (
    <section className="profile-section">
      <h1>Profil Utilisateur</h1>
      
      <div className="profile-avatar-container">
        <img 
          src={User.avatarUrl} 
          alt={`Icône de ${User.username}`} 
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
        <h2>{User.username}</h2>
        <p className="profile-points">
          <strong>Points récoltés :</strong> {User.points}
        </p>
      </div>
    </section>
  );
}

export default ProfilePage;