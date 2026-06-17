import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';

function ProfilePage() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!currentUser) {
    return <p>Utilisateur non connecté</p>;
  }

  const avatarUrl = currentUser.avatar_url ??
    'https://www.radiofrance.fr/pikapi/images/837695f1-b7da-48a1-94bf-c4901718432c/1200x680?webp=false';
  
  const handleChangeIcon = () => {
    alert("Ouverture de la sélection d'avatar (Base de données et Upload local)");
  };

  return (
    <PageContainer>
      <Heading>Profil Utilisateur</Heading>
      
      <div className="my-8 flex flex-col items-center gap-4">
        <img 
          src={avatarUrl} 
          alt={`Icône de ${currentUser.username}`} 
          className="w-[150px] h-[150px] rounded-full border-[3px] border-[#ccc] object-cover"
        />
        <button 
          onClick={handleChangeIcon}
          className="px-4 py-2 cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200"
        >
          Changer l'icône
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold m-0">{currentUser.username}</h2>
        <p className="text-[1.2rem] mt-2">
          <strong>Points récoltés :</strong> 0
        </p>
      </div>
    </PageContainer>
  );
}

export default ProfilePage;