import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, User, Swords, Ban } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { blockUser, getFriends, type FriendUser, type Friendship } from '../api/friends.api';
import { getConversation, type ChatMessage } from '../api/chat.api';
import { useSocialSocket } from '@/context/SocialSocketContext';
import { useLanguage } from '@/i18n/LanguageContext';

export function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [chatNotice, setChatNotice] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { socket, sendGameInvite, gameInviteError, clearGameInviteError, pendingGameInvite } = useSocialSocket();
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const typingStopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function getOtherUser(friendship: Friendship): FriendUser {
    if (!currentUser) {
      return friendship.requester;
    }

    return friendship.requester_id === currentUser.id
      ? friendship.addressee
      : friendship.requester;
  }


  function handleSendGameInvite(friendUser: FriendUser) {
    sendGameInvite(friendUser.id);
    setChatNotice(t('chat.invitationSent').replace('{username}', friendUser.username));
  }

  async function loadFriends() {
    if (!currentUser) {
      return;
    }

    try {
      const friendsData = await getFriends();
      setFriends(friendsData);
      setError(null);
    } catch {
      setError(t('chat.loadFriendsError'));
    }
  }

  // Load friends when auth is ready.
  useEffect(() => {
    loadFriends();
  }, [currentUser, t]);

  // Refresh friends on social socket updates.
  useEffect(() => {
    if (!socket || !currentUser) {
      return;
    }

    socket.on('friends_changed', loadFriends);

    return () => {
      socket.off('friends_changed', loadFriends);
    };
  }, [socket, currentUser]);

  // Listen to chat socket events for the active conversation.
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

      if (isOpen && receivedMessage.sender_id === selectedFriend.id) {
        socket?.emit('mark_message_read', {
          otherUserId: selectedFriend.id,
        });
      }
    }

    function handleTypingStarted(data: { userId: string }) {
      setTypingUserId(data.userId);
    }

    function handleTypingStopped(data: { userId: string }) {
      setTypingUserId((currentTypingUserId) => currentTypingUserId === data.userId ? null : currentTypingUserId);
    }

    function handleMessagesRead(data: { readerId: string; read_at: string}) {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.receiver_id === data.readerId
          ? { ...message, read_at: data.read_at }
          : message
        )
      );
    }

    function handleMessageError(err: { receiverId: String; message: string }) {
      if (selectedFriend && err.receiverId === selectedFriend.id) {
        setError(err.message);
      }
    }

    socket.on('message_received', handleMessageReceived);
    socket.on('typing_started', handleTypingStarted);
    socket.on('typing_stopped', handleTypingStopped);
    socket.on('message_read', handleMessagesRead);
    socket.on('message_error', handleMessageError);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('typing_started', handleTypingStarted);
      socket.off('typing_stopped', handleTypingStopped);
      socket.off('message_read', handleMessagesRead);
      socket.off('message_error', handleMessageError);
    };
  }, [socket, currentUser, selectedFriend, isOpen]);

  async function handleOpenConversation(friendUser: FriendUser) {
    if (!currentUser) {
      setError(t('chat.notConnected'));
      return;
    }

    clearGameInviteError();

    try {
      const conversation = await getConversation(friendUser.id);
      setSelectedFriend(friendUser);
      setMessages(conversation);

      socket?.emit('mark_message_read', {
        otherUserId: friendUser.id,
      });

      setChatNotice(null);
      setError(null);
    } catch {
      setError(t('chat.loadConversationError'));
    }
  }

  async function handleBlockUser(friendUser: FriendUser) {
    try {
      await blockUser(friendUser.id);
      setSelectedFriend(null);
      setMessages([]);
      setMessage('');
      setChatNotice(null);
      clearGameInviteError();
      await loadFriends();
      setError(null);
    } catch {
      setError(t('chat.blockError'));
    }
  }

  function handleMessageChange(value: string) {
    setMessage(value);

    if(!socket || !selectedFriend){
      return;
    }

    if(!value.trim()) {
      socket.emit('typing_stop', {
        receiverId: selectedFriend.id,
      });
      return;
    }

    socket.emit('typing_start', {
      receiverId: selectedFriend.id,
    });

    if (typingStopTimeout.current) {
      clearTimeout(typingStopTimeout.current);
    }

    typingStopTimeout.current = setTimeout(() => {
      socket.emit('typing_stop', {
        receiverId: selectedFriend.id,
      });
    }, 1000);
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
    socket.emit('typing_stop', {
      receiverId: selectedFriend.id,
    });
    setMessage('');
    setError(null);
  };

  return (
    <div className="fixed bottom-12 sm:bottom-11 right-4 sm:right-6 z-[1000] flex flex-col items-end">
      <div className={`mb-4 w-[calc(100vw-3rem)] sm:w-80 h-[75vh] sm:h-96 max-h-[500px] bg-[rgba(20,20,30,0.95)] backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" : "scale-75 opacity-0 translate-y-8 pointer-events-none"}`}> 
        {selectedFriend && (
          <div className="flex items-center gap-3 border-b border-white/10 bg-[#15151a] px-4 py-3">
            <button
              type="button"
              onClick={() => {
                setSelectedFriend(null);
                setMessages([]);
                setMessage('');
                setChatNotice(null);
                setTypingUserId(null);
				setError(null);
                if (typingStopTimeout.current) {
                  clearTimeout(typingStopTimeout.current);
                }
                clearGameInviteError();
              }}
              className="text-sm text-slate-400 hover:text-white"
            >
              {t('chat.back')}
            </button>
            <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-slate-100">{selectedFriend.username}</span>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                onClick={() => navigate(`/profile/${selectedFriend.id}`)}
                className="h-8 w-8 p-0 bg-slate-700 text-white hover:bg-slate-600"
                title={t('chat.viewProfile')}
              >
                <User size={16} />
              </Button>

              <Button
                type="button"
                onClick={() => handleSendGameInvite(selectedFriend)}
                className="h-8 w-8 p-0 bg-green-600 text-white hover:bg-green-500"
                title={t('chat.inviteToGame')}
              >
                <Swords size={16} />
              </Button>

              <Button
                type="button"
                onClick={() => handleBlockUser(selectedFriend)}
                className="h-8 w-8 p-0 bg-red-600 text-white hover:bg-red-500"
                title={t('chat.block')}
              >
                <Ban size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto overscroll-contain touch-pan-y flex flex-col gap-3">
          {(error || gameInviteError) && (
            <p className="text-sm text-red-400">{error || gameInviteError}</p>
          )}

          {chatNotice && (
            <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-300">
              {chatNotice}
            </p>
          )}

          {pendingGameInvite && (
            <p className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm text-blue-300">
              {t('chat.gameInvitation').replace('{username}', pendingGameInvite.inviterUsername)}
            </p>
          )}

          {!currentUser ? (
            <p className="text-sm text-slate-400">{t('chat.loginRequired')}</p>
          ) : !selectedFriend ? (
            friends.length > 0 ? (
              friends.map((friendship) => {
                const friendUser = getOtherUser(friendship);

                return (
                  <button
                    key={friendship.id}
                    type="button"
                    onClick={() => handleOpenConversation(friendUser)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/10 touch-manipulation select-none"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-100">{friendUser.username}</span>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">{t('chat.noFriends')}</p>
            )
          ) : (
            <>
              {messages.map((msg) => {
                const isMine = msg.sender_id === currentUser.id;

                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-gray-400 mb-1 px-1">
                      {isMine ? t('chat.me') : msg.sender.username}
                    </span>
                    <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#2a2a35] text-gray-200 rounded-bl-none'}`}>
                      {msg.content}
                    </div>
                    {isMine && msg.read_at && (
                      <span className="mt-1 text-[10px] text-slate-400">
                        {t('chat.read')}
                      </span>
                    )}
                  </div>
                );
              })}

              {typingUserId === selectedFriend.id && (
                <p className="text-xs italic text-slate-400">
                  {t('chat.typing').replace('{username}', selectedFriend.username)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Send form */}
        {selectedFriend && (
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#15151a] flex items-center gap-2">
            <Input 
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder= {t("chat.messagePlaceholder")}
              className="flex-1 h-10 m-0 !mt-0 !mb-0 bg-[#2a2a35] border-white/5 focus-visible:ring-blue-500"
            />
            <Button type="submit" aria-label={t('chat.send')} className="h-10 w-10 p-0 flex items-center justify-center m-0 !mt-0 !mb-0 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              <Send size={18} className="ml-[-2px]" />
            </Button>
          </form>
        )}
      </div>

      {/* Floating button to open or close chat */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full text-2xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:scale-110"
      >
        {isOpen ? '✕' : '💬'}
      </Button>
    </div>
  );
}
