import { useEffect, useState } from 'react';
import { Gamepad2, MessageCircle, User, UserPlus, UserX } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { acceptFriendRequest, deleteFriendship, getFriends, getReceivedFriendRequests, sendFriendRequest, type FriendRequest, type Friendship, type FriendUser } from '../api/friends.api';
import { getUserByUsername } from '../api/users.api';
import { Button } from '../components/ui/button';
import { Heading } from '../components/ui/heading';
import { Input } from '../components/ui/input';
import { PageContainer } from '../components/ui/page-content';

function FriendsList() {
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

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
      setError('Session expirée');
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
      setError('Impossible de charger les amis');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFriendsData();
  }, []);

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
      setError('Impossible de supprimer cet ami');
    }
  }

  return (
    <PageContainer>
      <div className="mb-8 text-center uppercase tracking-widest">
        <Heading>Liste d'Amis</Heading>
      </div>

      {isLoading && <p className="mb-4 text-center text-slate-300">Chargement...</p>}
      {error && <p className="mb-4 text-center text-red-300">{error}</p>}

      {friendRequests.length > 0 && (
        <section className="mb-8 flex flex-col gap-3">
          <h2 className="text-left text-lg font-bold text-[#f1c40f]">Demandes reçues</h2>
          {friendRequests.map((request) => (
            <div key={request.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800">
                <User className="text-slate-400" size={22} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="m-0 text-base font-bold text-slate-100">{request.requester.username}</h3>
                <p className="m-0 text-sm text-slate-400">Demande d'ami</p>
              </div>
              <Button
                className="bg-blue-600 font-medium hover:bg-blue-500"
                onClick={() => handleAcceptRequest(request.id)}
              >
                Accepter
              </Button>
            </div>
          ))}
        </section>
      )}

      <section className="mb-8 flex flex-col gap-2 text-left">
        <span className="text-xs font-bold uppercase tracking-[1px] text-[#f1c40f]">Ajouter un ami</span>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder="Nom d'utilisateur"
              value={usernameToAdd}
              onChange={(event) => setUsernameToAdd(event.target.value)}
              className="h-12 pl-10"
            />
          </div>
          <Button
            className="h-12 bg-blue-600 px-6 font-medium hover:bg-blue-500"
            onClick={handleSendFriendRequest}
          >
            Ajouter
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        {friends.length > 0 ? (
          friends.map((friendship) => {
            const friendUser = getOtherUser(friendship);

            return (
              <div key={friendship.id} className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/10">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                  <User className="text-slate-400" size={24} />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#15151a] bg-slate-500"></span>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="m-0 text-lg font-bold text-slate-100">{friendUser.username}</h3>
                  <p className="m-0 mt-0.5 text-sm font-medium text-slate-500">Ami</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" className="h-10 w-10 p-0 text-slate-300 hover:bg-white/10 hover:text-white" title="Message">
                    <MessageCircle size={18} />
                  </Button>
                  <Button variant="ghost" className="h-10 w-10 p-0 text-slate-300 hover:bg-white/10 hover:text-white" title="Inviter à jouer">
                    <Gamepad2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    title="Retirer l'ami"
                    onClick={() => handleDeleteFriendship(friendship.id)}
                  >
                    <UserX size={18} />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <UserX className="mx-auto mb-4 text-slate-500" size={48} />
            <p className="text-lg font-medium text-slate-400">Aucun ami trouvé.</p>
          </div>
        )}
      </section>
    </PageContainer>
  );
}

export default FriendsList;
