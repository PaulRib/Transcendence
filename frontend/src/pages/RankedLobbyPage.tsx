import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useLanguage } from '@/i18n/LanguageContext';
import { getFriends, type FriendUser, type Friendship } from '../api/friends.api';
import { useAuth } from '../auth/AuthContext';
import { useSocialSocket } from '../context/SocialSocketContext';

interface RankedLobbyPageProps {
  socket: Socket | null;
}

function RankedLobbyPage({ socket }: RankedLobbyPageProps) {
  // État pour savoir si le joueur est dans la file d'attente
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useLanguage();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { sendGameInvite, gameInviteError } = useSocialSocket();

  function getOtherUser(friendship: Friendship): FriendUser {
    if (!currentUser) {
      return friendship.requester;
    }

    return friendship.requester_id === currentUser.id
      ? friendship.addressee
      : friendship.requester;
  }

  useEffect(() => {
    if (!socket) return;

    socket.on('matchmaking_started', () => {
      setIsSearching(true);
    });

    socket.on('matchmaking_cancelled', () => {
      setIsSearching(false);
    });

    return () => {
      socket.off('matchmaking_started');
      socket.off('matchmaking_cancelled');
    };
  }, [socket]);

  useEffect(() => {
    async function loadFriends() {
      if (!currentUser) {
        return;
      }

      try {
        const friendsData = await getFriends();
        setFriends(friendsData);
      } catch {
        setInviteStatus(t('multiplayer.loadFriendsError'));
      }
    }

    loadFriends();
  }, [currentUser, t]);

  const handleJoinMatchmaking = () => {
    if (socket) {
      socket.emit('join_matchmaking');
      setIsSearching(true);
    }
  };

  const handleLeaveMatchmaking = () => {
    if (socket) {
      socket.emit('leave_matchmaking');
      setIsSearching(false);
    }
  };

  const handleInviteFriend = () => {
    if (!selectedFriendId) {
      setInviteStatus(t('multiplayer.selectFriendError'));
      return;
    }

    sendGameInvite(selectedFriendId);
    setInviteStatus(t('multiplayer.invitationSent'));
  };

  return (
    <div className="lobby-container p-4 sm:p-8 md:p-12 text-center w-full max-w-4xl mx-auto min-w-0" style={{ textAlign: 'center' }}>
      <h2>{t("selectGame.rankedTitle")} (1v1) - {t("multiplayer.lobby")}</h2>
      <p>{t("multiplayer.prouve")}</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        
        {/* SECTION MATCHMAKING (Nouveau) */}
        <div 
          className="lobby-card" 
          style={{ 
            padding: '20px', 
            border: `2px dashed ${isSearching ? '#FF9800' : '#9C27B0'}`, 
            borderRadius: '12px', 
            backgroundColor: isSearching ? 'rgba(255, 152, 0, 0.1)' : 'rgba(156, 39, 176, 0.1)',
            flex: '1',
            minWidth: '260px',
            maxWidth: '400px',
            transition: 'all 0.3s ease'
          }}
        >
          <h3>{t("multiplayer.randomMatchmaking")}</h3>
          <p>{isSearching ? t("multiplayer.findingOpponent") : t("multiplayer.facePlayer")}</p>
          
          {!isSearching ? (
            <button 
              onClick={handleJoinMatchmaking}
              disabled={!socket}
              style={{ 
                marginTop: '20px', padding: '12px 24px', cursor: socket ? 'pointer' : 'not-allowed',
                backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '8px',
                fontWeight: 'bold', fontSize: '16px'
              }}
            >
              {t("multiplayer.findMatch")}
            </button>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <div className="loader" style={{ marginBottom: '15px' }}>⏳ {t("multiplayer.searchInProgress")}</div>
              <button 
                onClick={handleLeaveMatchmaking}
                style={{ 
                  padding: '8px 16px', cursor: 'pointer',
                  backgroundColor: 'transparent', color: '#FF9800', border: '1px solid #FF9800', 
                  borderRadius: '8px', fontWeight: 'bold'
                }}
              >
                {t("multiplayer.cancel")}
              </button>
            </div>
          )}
        </div>

        {/* SECTION INVITATION AMI (Placeholder) */}
        <div 
          className="lobby-card" 
          style={{ 
            padding: '20px', 
            border: '2px dashed #4CAF50', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            flex: '1',
            minWidth: '260px',
            maxWidth: '400px'
          }}
        >
          <h3>{t('multiplayer.startChallenge')}</h3>
          <p>{t('multiplayer.inviteToPlay')}</p>
          <select
            value={selectedFriendId}
            onChange={(event) => {
              setSelectedFriendId(event.target.value);
              setInviteStatus(null);
            }}
            style={{
              marginTop: '15px',
              padding: '10px',
              width: '100%',
              borderRadius: '8px',
              backgroundColor: '#15151a',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <option value="">{t('multiplayer.chooseFriend')}</option>
            {friends.map((friendship) => {
              const friendUser = getOtherUser(friendship);

              return (
                <option key={friendship.id} value={friendUser.id}>
                  {friendUser.username}
                </option>
              );
            })}
          </select>

          <button 
            onClick={handleInviteFriend}
            disabled={!selectedFriendId}
            style={{ 
                marginTop: '20px', padding: '12px 24px', cursor: selectedFriendId ? 'pointer' : 'not-allowed',
                backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px',
                fontWeight: 'bold', fontSize: '16px', opacity: selectedFriendId ? 1 : 0.6
            }}
          >
            {t("multiplayer.inviteFriend")}
          </button>
          {(inviteStatus || gameInviteError) && (
            <p style={{ marginTop: '12px', color: gameInviteError ? '#F44336' : '#9CA3AF', fontSize: '14px' }}>
              {gameInviteError || inviteStatus}
            </p>
          )}
        </div>

      </div>

      <div style={{ marginTop: '50px', color: '#888', fontStyle: 'italic', fontSize: '14px' }}>
        <p>💡 {t("multiplayer.friendInvInfo")} </p>
        {!socket && <p style={{ color: '#F44336' }}>⚠️ {t("multiplayer.connectingToGameServer")} </p>}
      </div>
    </div>
  );
}

export default RankedLobbyPage;
