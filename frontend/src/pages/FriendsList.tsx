import { useState } from 'react';
import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

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
    <PageContainer>
      <div className="text-center mb-8  uppercase tracking-[2px]">
        <Heading>Liste d'Amis</Heading>
      </div>
      
      <div className="flex gap-4 mb-8">
        <Input 
          type="text" 
          placeholder="Rechercher un ami..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button className="px-6 py-6  bg-[#f1c40f] text-[#111] transition-colors duration-200 bg-[#d4ac0d]">
          Ajouter
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div key={friend.id} className="flex items-center bg-[#2a2a35] p-4 rounded-lg gap-6">
              <div className="relative w-[50px] h-[50px] bg-[#3b3b4f] rounded-full flex items-center justify-center text-2xl">
                <span className="avatar-placeholder">👤</span>
                <span className={`absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full border-2 border-[#2a2a35] ${
                  friend.status === 'online' ? 'bg-[#2ecc71]' : 
                  friend.status === 'in-game' ? 'bg-[#9b59b6]' : 
                  'bg-[#95a5a6]'
                }`}></span>
              </div>
              <div className="flex-1">
                <h3 className="m-0 mb-1 text-[1.2rem]">{friend.username}</h3>
                <p className="m-0 text-[0.9rem] text-[#bdc3c7]">
                  {friend.status === 'online' && 'En ligne'}
                  {friend.status === 'in-game' && 'En jeu'}
                  {friend.status === 'offline' && 'Hors ligne'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button className="text-[1.2rem] p-2 transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title="Message">💬</Button>
                <Button className="text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title="Inviter à joue" disabled={friend.status === 'offline'}>🎮</Button>
                <Button className="text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title="Retirer">❌</Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#7f8c8d] italic p-8">Aucun ami trouvé.</p>
        )}
      </div>
    </PageContainer>
  );
}

export default FriendsList;