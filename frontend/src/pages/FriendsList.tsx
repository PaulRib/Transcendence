import { useState } from 'react';
import { Heading } from '../components/ui/heading';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t } = useLanguage();

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[800px] mx-auto my-8 p-8 bg-[rgba(20,20,30,0.85)] rounded-xl text-white shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
      <div className="text-center mb-8  uppercase tracking-[2px]">
        <Heading>{t("friends.title")}</Heading>
      </div>
      
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          placeholder={t("friends.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border border-[#444] bg-[#2a2a35] text-white text-base focus:outline-none focus:border-[#f1c40f]"
        />
        <button className="px-6 py-3 rounded-lg bg-[#f1c40f] text-[#111] font-bold transition-colors duration-200 hover:bg-[#d4ac0d]">
          {t("friends.add")}
        </button>
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
                  {friend.status === 'online' && t("friends.online")}
                  {friend.status === 'in-game' && t("friends.inGame")}
                  {friend.status === 'offline' && t("friends.offline")}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-transparent text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title={t("friends.messageTitle")}>💬</button>
                <button className="bg-transparent text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title={t("friends.inviteTitle")} disabled={friend.status === 'offline'}>🎮</button>
                <button className="bg-transparent text-[1.2rem] p-2 rounded-lg transition-colors duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" title={t("friends.removeTitle")}>❌</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#7f8c8d] italic p-8">{t("friends.empty")}</p>
        )}
      </div>
    </div>
  );
}

export default FriendsList;