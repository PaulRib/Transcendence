import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, MessageCircle, Gamepad2, UserX, UserPlus, Search } from 'lucide-react';
import { acceptFriendRequest, deleteFriendship, getFriends, getReceivedFriendRequests, type Friendship, type FriendRequest, type FriendUser, sendFriendRequest } from '../api/friends.api';
import { getUserByUsername } from '../api/users.api';

function FriendsList() {
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();


  async function handleSendFriendRequest() {
    const token = getToken();
    const trimmedUsername = usernameToAdd.trim();

    if (!token || !trimmedUsername) {
      return;
    }

    try {
      const targetUser = await getUserByUsername(trimmedUsername);
      await sendFriendRequest(token, targetUser.id);
      await loadFriendsData();
      setUsernameToAdd('');
      setError(null);
    } catch {
      setError("Impossible d'envoyer la demande d'ami");
    }
  }

  function getOtherUser(friendship: Friendship): FriendUser {
    if (!currentUser) {
      return friendship.requester;
    }

    return friendship.requester_id === currentUser.id
      ? friendship.addressee
      : friendship.requester;
  }

  function getToken() {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError("Session expirée");
      return null;
    }

    return token;
  }

  async function loadFriendsData() {
    const token = getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const [friendsData, requestsData] = await Promise.all([
        getFriends(token),
        getReceivedFriendRequests(token),
      ]);

      setFriends(friendsData);
      setFriendRequests(requestsData);
      setError(null);
    } catch {
      setError("Impossible de charger les amis");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFriendsData();
  }, []);

  async function handleAcceptRequest(requestId: string) {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      await acceptFriendRequest(token, requestId);
      await loadFriendsData();
    } catch {
      setError("Impossible d'accepter la demande");
    }
  }

  async function handleDeleteFriendship(friendshipId: string) {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      await deleteFriendship(token, friendshipId);
      await loadFriendsData();
    } catch {
      setError("Impossible de supprimer cet ami");
    }
  }

  return (
    <PageContainer>
      <div className="text-center mb-8 uppercase tracking-widest">
        <Heading>Liste d'Amis</Heading>
      </div>

      {isLoading && <p className="text-center text-[#bdc3c7] mb-4">Chargement...</p>}
      {error && <p className="text-center text-red-300 mb-4">{error}</p>}

      {friendRequests.length > 0 && (
        <div className="mb-8 flex flex-col gap-3">
          <h2 className="text-left text-lg font-bold text-[#f1c40f]">Demandes reçues</h2>
          {friendRequests.map((request) => (
            <div key={request.id} className="flex items-center bg-[#2a2a35] p-4 rounded-lg gap-4">
              <div className="w-[44px] h-[44px] bg-[#3b3b4f] rounded-full flex items-center justify-center text-xl">
                <span className="avatar-placeholder">👤</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="m-0 mb-1 text-[1.05rem]">{request.requester.username}</h3>
                <p className="m-0 text-[0.85rem] text-[#bdc3c7]">Demande d'ami</p>
              </div>
              <button
                className="px-4 py-2 rounded-lg bg-[#f1c40f] text-[#111] font-bold transition-colors duration-200 hover:bg-[#d4ac0d]"
                onClick={() => handleAcceptRequest(request.id)}
              >
                Accepter
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            type="text" 
            placeholder="Rechercher un ami..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 m-0 !mb-0 !mt-0 h-12"
          />
        </div>
        <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-500 font-medium">
          <UserPlus size={18} className="mr-2" /> Ajouter
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div key={friend.id} className="flex items-center bg-white/5 border border-white/10 p-4 rounded-xl gap-5 transition-all duration-200 hover:bg-white/10 hover:border-white/20">
              {/* Avatar et statut */}
              <div className="relative w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <User className="text-slate-400" size={24} />
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#15151a] ${
                  friend.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 
                  friend.status === 'in-game' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 
                  'bg-slate-500'
                }`}></span>
      <div className="mb-8 flex flex-col gap-2 text-left">
        <span className="text-xs font-bold uppercase tracking-[1px] text-[#f1c40f]">Ajouter un ami</span>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={usernameToAdd}
            onChange={(e) => setUsernameToAdd(e.target.value)}
            className="min-w-0 flex-1 px-4 py-3 rounded-lg border border-[#444] bg-[#2a2a35] text-white text-base focus:outline-none focus:border-[#f1c40f]"
          />
          <button
            className="px-5 py-3 rounded-lg bg-[#f1c40f] text-[#111] font-bold transition-colors duration-200 hover:bg-[#d4ac0d]"
            onClick={handleSendFriendRequest}
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {friends.length > 0 ? (
          friends.map((friendship) => {
            const friendUser = getOtherUser(friendship);

            return (
            <div key={friendship.id} className="flex items-center bg-[#2a2a35] p-4 rounded-lg gap-6">
              <div className="relative w-[50px] h-[50px] bg-[#3b3b4f] rounded-full flex items-center justify-center text-2xl">
                <span className="avatar-placeholder">👤</span>
                <span className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full border-2 border-[#2a2a35] bg-[#95a5a6]"></span>
              </div>

              {/* Infos Utilisateur */}
              <div className="flex-1">
                <h3 className="m-0 text-lg font-bold text-slate-100">{friend.username}</h3>
                <p className="m-0 text-sm font-medium mt-0.5">
                  {friend.status === 'online' && <span className="text-emerald-400">En ligne</span>}
                  {friend.status === 'in-game' && <span className="text-purple-400">En jeu</span>}
                  {friend.status === 'offline' && <span className="text-slate-500">Hors ligne</span>}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="ghost" className="w-10 h-10 p-0 text-slate-300 hover:text-white hover:bg-white/10" title="Message">
                  <MessageCircle size={18} />
                </Button>
                <Button variant="ghost" className="w-10 h-10 p-0 text-slate-300 hover:text-white hover:bg-white/10" title="Inviter à jouer" disabled={friend.status === 'offline'}>
                  <Gamepad2 size={18} />
                </Button>
                <Button variant="ghost" className="w-10 h-10 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10" title="Retirer l'ami">
                  <UserX size={18} />
                </Button>
                <h3 className="m-0 mb-1 text-[1.2rem]">{friendUser.username}</h3>
                <p className="m-0 text-[0.9rem] text-[#bdc3c7]">
                  Ami
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-transparent text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title="Message">💬</button>
                <button className="bg-transparent text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title="Inviter à jouer">🎮</button>
                <button
                  className="bg-transparent text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Retirer"
                  onClick={() => handleDeleteFriendship(friendship.id)}
                >
                  ❌
                </button>
              </div>
            </div>
            );
          })
        ) : (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl">
            <UserX className="mx-auto mb-4 text-slate-500" size={48} />
            <p className="text-slate-400 text-lg font-medium">Aucun ami trouvé.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default FriendsList;
