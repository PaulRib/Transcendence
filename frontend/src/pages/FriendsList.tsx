import { useEffect, useState } from 'react';
import { Gamepad2, MessageCircle, User, UserPlus, UserX } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { acceptFriendRequest, deleteFriendship, getFriends, getReceivedFriendRequests, type Friendship, type FriendRequest, type FriendUser, sendFriendRequest } from '../api/friends.api';
import { getUserByUsername } from '../api/users.api';
import { Button } from '../components/ui/button';
import { Heading } from '../components/ui/heading';
import { Input } from '../components/ui/input';
import { PageContainer } from '../components/ui/page-content';
import { useLanguage } from '../i18n/LanguageContext';
import { useSocialSocket } from '@/context/SocialSocketContext';

type FriendStatusChangedPayload = {
  userId: string;
  isOnline: boolean;
};

function FriendsList() {
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const { socket } = useSocialSocket();
  const { t } = useLanguage();

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
      setError(t("friends.expired"));
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
      setError(t("friends.cantcharge"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFriendsData();
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function updateFriendOnlineStatus(friend: FriendUser, data: FriendStatusChangedPayload): FriendUser {
      if (friend.id !== data.userId) {
        return friend;
      }

      return {
        ...friend,
        is_online: data.isOnline,
      };
    }

    function handleFriendStatusChanged(data: FriendStatusChangedPayload) {
      setFriends((currentFriends) => {
        return currentFriends.map((friendship) => {
          return {
            ...friendship,
            requester: updateFriendOnlineStatus(friendship.requester, data),
            addressee: updateFriendOnlineStatus(friendship.addressee, data),
          };
        });
      });
    }

    socket.on('friend_status_changed', handleFriendStatusChanged);

    return () => {
      socket.off('friend_status_changed', handleFriendStatusChanged);
    };
  }, [socket]);

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
      setError(t("friends.cantsend"));
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
      setError(t("friends.cantaccept"));
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
      setError(t("friends.cantdelete"));
    }
  }

  return (
    <PageContainer>
      <div className="mb-8 text-center uppercase tracking-widest">
        <Heading>{t("friends.title")}</Heading>
      </div>

      {isLoading && <p className="mb-4 text-center text-slate-300">{t("friends.loading")}</p>}
      {error && <p className="mb-4 text-center text-red-300">{error}</p>}

      {friendRequests.length > 0 && (
        <section className="mb-8 flex flex-col gap-3">
          <h2 className="text-left text-lg font-bold text-[#f1c40f]">{t("friends.inviteTitle")}</h2>
          {friendRequests.map((request) => (
            <div key={request.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800">
                <User className="text-slate-400" size={22} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="m-0 text-base font-bold text-slate-100">{request.requester.username}</h3>
                <p className="m-0 text-sm text-slate-400">{t("friends.request")}</p>
              </div>
              <Button
                className="bg-blue-600 font-medium hover:bg-blue-500"
                onClick={() => handleAcceptRequest(request.id)}
              >
                {t("friends.accept")}
              </Button>
            </div>
          ))}
        </section>
      )}

      <section className="mb-8 flex flex-col gap-2 text-left">
        <span className="text-xs font-bold uppercase tracking-[1px] text-[#f1c40f]">{t("friends.add")}</span>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder={t("friends.username")}
              value={usernameToAdd}
              onChange={(event) => setUsernameToAdd(event.target.value)}
              className="h-12 pl-10"
            />
          </div>
          <Button
            className="h-12 bg-blue-600 px-6 font-medium hover:bg-blue-500"
            onClick={handleSendFriendRequest}
          >
            {t("friends.add")}
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
                  <span
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#15151a] ${
                      friendUser.is_online ? 'bg-green-500' : 'bg-slate-500'
                    }`}
                  ></span>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="m-0 text-lg font-bold text-slate-100">{friendUser.username}</h3>
                  <p className="m-0 mt-0.5 text-sm font-medium text-slate-500">{t("friends.friend")}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" className="h-10 w-10 p-0 text-slate-300 hover:bg-white/10 hover:text-white" title={t("friends.messageTitle")}>
                    <MessageCircle size={18} />
                  </Button>
                  <Button variant="ghost" className="h-10 w-10 p-0 text-slate-300 hover:bg-white/10 hover:text-white" title={t("friends.inviteTitle")}>
                    <Gamepad2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    title={t("friends.removeTitle")}
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
            <p className="text-lg font-medium text-slate-400">{t("friends.empty")}</p>
          </div>
        )}
      </section>
    </PageContainer>
  );
}

export default FriendsList;
