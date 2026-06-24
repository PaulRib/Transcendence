import { useAuth } from '../auth/AuthContext';
import { PageContainer } from '../components/ui/page-content';
import { Heading } from '../components/ui/heading';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!currentUser) {
    return <p>Utilisateur non connecté</p>;
  }

  const avatarUrl = currentUser.avatar_url;
  
  const handleChangeIcon = () => {
    navigate('/settings');
  };

  return (
    <PageContainer>
      <Heading>{currentUser.username}</Heading>
      
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-[150px] h-[150px] border-[3px] border-[#ccc] shadow-xl">
          <AvatarImage src={avatarUrl} alt={`Icône de ${currentUser.username}`} />
          <AvatarFallback className="text-4xl text-white">{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
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
//Gestion backend, connecter l'avatar ici aussi
export default ProfilePage;