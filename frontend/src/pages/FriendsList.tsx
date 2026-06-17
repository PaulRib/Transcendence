import { useState } from 'react';
import '../css/FriendsList.css'; // We will create this file for styling



interface Friend {
  id: number;
  username: string;
  status: 'online' | 'in-game' | 'offline';
  avatar?: string;
}

const mockFriends: Friend[] = [
  { id: 1, username: 'johndoe', status: 'online' },
  { id: 2, username: 'janedoe', status: 'in-game' },
  { id: 3, username: 'faker', status: 'offline' },
  { id: 4, username: 'caps', status: 'online' },
];

function FriendsList() {
  const [friends] = useState<Friend[]>(mockFriends);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="friends-list-container">
      <h1>Liste d'Amis</h1>
      
      <div className="friends-search">
        <input 
          type="text" 
          placeholder="Rechercher un ami..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="add-friend-btn">Ajouter</button>
      </div>

      <div className="friends-grid">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <div className="friend-avatar">
                {/* Fallback emoji as avatar */}
                <span className="avatar-placeholder">👤</span>
                <span className={`status-indicator ${friend.status}`}></span>
              </div>
              <div className="friend-info">
                <h3>{friend.username}</h3>
                <p className="friend-status">
                  {friend.status === 'online' && 'En ligne'}
                  {friend.status === 'in-game' && 'En jeu'}
                  {friend.status === 'offline' && 'Hors ligne'}
                </p>
              </div>
              <div className="friend-actions">
                <button className="action-btn message-btn" title="Message">💬</button>
                <button className="action-btn play-btn" title="Inviter à jouer" disabled={friend.status === 'offline'}>🎮</button>
                <button className="action-btn remove-btn" title="Retirer">❌</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-friends-text">Aucun ami trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default FriendsList;
