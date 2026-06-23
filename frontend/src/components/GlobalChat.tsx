import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

export function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  // Messages factices pour l'UI, le collègue connectera le backend plus tard
  const [messages, setMessages] = useState<{user: string, text: string}[]>([
    { user: 'Système', text: 'Bienvenue dans le chat !' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Ajout local pour faire joli
    setMessages([...messages, { user: 'Moi', text: message }]);
    setMessage('');
    
    // TODO: Le collègue s'occupera d'envoyer 'message' via WebSocket / API ici
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
      {/* Fenêtre de chat animée */}
      <div className={`mb-4 w-80 h-96 bg-[rgba(20,20,30,0.95)] backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" : "scale-75 opacity-0 translate-y-8 pointer-events-none"}`}> 
        {/* Zone des messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.user === 'Moi' ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-400 mb-1 px-1">{msg.user}</span>
              <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words shadow-sm ${msg.user === 'Moi' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#2a2a35] text-gray-200 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire d'envoi */}
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
