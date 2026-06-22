import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { Button } from '../components/ui/button';

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
      <Heading>{currentUser.username}</Heading>
      
      <div className="flex flex-col items-center gap-4">
        <img 
          src={avatarUrl} 
          alt={`Icône de ${currentUser.username}`} 
          className="w-[150px] h-[150px] rounded-full border-[3px] border-[#ccc] object-cover"
        />
        <Button 
          onClick={handleChangeIcon}
        >
          Changer l'icône
        </Button>
      </div>

      <div className="text-center">
        <p className="text-[1.2rem] mt-2">
          <strong>Points récoltés :</strong> 0
        </p>
      </div>
    </PageContainer>
  );
}

export default ProfilePage;