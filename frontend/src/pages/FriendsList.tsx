import { useState } from 'react';
import { Heading } from '../components/ui/heading';
import { PageContainer } from '../components/ui/page-content';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, MessageCircle, Gamepad2, UserX, UserPlus, Search } from 'lucide-react';

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
      <div className="text-center mb-8 uppercase tracking-widest">
        <Heading>Liste d'Amis</Heading>
      </div>
      
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
              </div>
            </div>
          ))
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