import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, User , Swords } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getFriends, type FriendUser, type Friendship } from '../api/friends.api';
import { getConversation, type ChatMessage } from '../api/chat.api';
import { useSocialSocket } from '@/context/SocialSocketContext';

export function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { socket, sendGameInvite, gameInviteError } = useSocialSocket();

  function getToken() {
    return localStorage.getItem('access_token');
  }

  function getOtherUser(friendship: Friendship): FriendUser {
    if (!currentUser) {
      return friendship.requester;
    }

    return friendship.requester_id === currentUser.id
      ? friendship.addressee
      : friendship.requester;
  }

  useEffect(() => {
    async function loadFriends() {
      const token = getToken();

      if (!token || !currentUser) {
        return;
      }

      try {
        const friendsData = await getFriends(token);
        setFriends(friendsData);
        setError(null);
      } catch {
        setError('Impossible de charger les amis');
      }
    }

    loadFriends();
  }, [currentUser]);

  useEffect(() => {
    if (!socket || !currentUser) {
      return;
    }

    function handleMessageReceived(receivedMessage: ChatMessage) {
      const isCurrentConversation = selectedFriend &&
      (
        receivedMessage.sender_id === selectedFriend.id ||
        receivedMessage.receiver_id === selectedFriend.id
      );

      if (!isCurrentConversation) {
        return;
      }

      setMessages((currentMessages) => {
        const messageAlreadyExists = currentMessages.some(
          (message) => message.id === receivedMessage.id
        );

        if (messageAlreadyExists) {
          return currentMessages;
        }

        return [...currentMessages, receivedMessage];
      });
    }

    socket.on('message_received', handleMessageReceived);

    return () => {
      socket.off('message_received', handleMessageReceived);
    };
  }, [socket, currentUser, selectedFriend]);

  async function handleOpenConversation(friendUser: FriendUser) {
    const token = getToken();

    if (!token) {
      setError('Utilisateur non connecté');
      return;
    }

    try {
      const conversation = await getConversation(token, friendUser.id);
      setSelectedFriend(friendUser);
      setMessages(conversation);
      setError(null);
    } catch {
      setError('Impossible de charger la conversation');
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!socket || !selectedFriend || !trimmedMessage) {
      return;
    }

    socket.emit('send_message', {
      receiverId: selectedFriend.id,
      content: trimmedMessage,
    });

    setMessage('');
    setError(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
      {/* Fenêtre de chat animée */}
      <div className={`mb-4 w-80 h-96 bg-[rgba(20,20,30,0.95)] backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" : "scale-75 opacity-0 translate-y-8 pointer-events-none"}`}> 
        {selectedFriend && (
          <div className="flex items-center justify-between border-b border-white/10 bg-[#15151a] px-4 py-3">
            <button
              type="button"
              onClick={() => {
                setSelectedFriend(null);
                setMessages([]);
                setMessage('');
              }}
              className="text-sm text-slate-400 hover:text-white"
            >
              Retour
            </button>
            <span className="text-sm font-semibold text-slate-100">{selectedFriend.username}</span>

            <Button
              type="button"
              onClick={() => sendGameInvite(selectedFriend.id)}
              className="h-8 w-8 p-0 bg-green-600 text-white hover:bg-green-500"
              title="Inviter en partie"
              >
                <Swords size={16} />
              </Button>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {(error || gameInviteError) && (
            <p className="text-sm text-red-400">{error || gameInviteError}</p>
          )}

          {!currentUser ? (
            <p className="text-sm text-slate-400">Connecte-toi pour utiliser le chat.</p>
          ) : !selectedFriend ? (
            friends.length > 0 ? (
              friends.map((friendship) => {
                const friendUser = getOtherUser(friendship);

                return (
                  <button
                    key={friendship.id}
                    type="button"
                    onClick={() => handleOpenConversation(friendUser)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-100">{friendUser.username}</span>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">Aucun ami disponible.</p>
            )
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUser.id;

              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-400 mb-1 px-1">
                    {isMine ? 'Moi' : msg.sender.username}
                  </span>
                  <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#2a2a35] text-gray-200 rounded-bl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Formulaire d'envoi */}
        {selectedFriend && (
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#15151a] flex items-center gap-2">
            <Input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              className="flex-1 h-10 m-0 !mt-0 !mb-0 bg-[#2a2a35] border-white/5 focus-visible:ring-blue-500"
            />
            <Button type="submit" aria-label="Envoyer" className="h-10 w-10 p-0 flex items-center justify-center m-0 !mt-0 !mb-0 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              <Send size={18} className="ml-[-2px]" />
            </Button>
          </form>
        )}
      </div>

      {/* Bouton flottant pour ouvrir/fermer le chat */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full text-2xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:scale-110"
      >
        {isOpen ? '✕' : '💬'}
      </Button>
    </div>
  );
}
