import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from "../i18n/LanguageContext";

const DEFAULT_AVATARS = [
  "https://cdn.intra.42.fr/users/3bf69c389f36c86e822b07a0167b858c/lsaiti.jpg",
  "https://www.radiofrance.fr/pikapi/images/837695f1-b7da-48a1-94bf-c4901718432c/1200x680?webp=false",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=68",
];

type AvatarPickerProps = {
  currentAvatar: string | null;
  onAvatarChange: (newAvatar: string | null) => void;
};

export function AvatarPicker({ currentAvatar, onAvatarChange }: AvatarPickerProps) {
  const [activeTab, setActiveTab] = useState<'default' | 'link' | 'upload'>('default');
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleDefaultClick = (url: string) => {
    onAvatarChange(url);
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkInput.trim() !== '') {
      onAvatarChange(linkInput.trim());
      setLinkInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      onAvatarChange(base64String); 
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Selection controls */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        <Button type="button" variant={activeTab === 'default' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('default')}>{t("settings.default")}</Button>
        <Button type="button" variant={activeTab === 'link' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('link')}>{t("settings.webLink")}</Button>
        <Button type="button" variant={activeTab === 'upload' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('upload')}>{t("settings.importFile")}</Button>
      </div>

      {activeTab === 'default' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-2">
          {DEFAULT_AVATARS.map((url, i) => (
            <button 
              key={i} 
              type="button"
              onClick={() => handleDefaultClick(url)}
              className={`rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${currentAvatar === url ? 'border-blue-500 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-transparent hover:border-white/30'}`}
            >
              <img src={url} alt={`Default ${i}`} className="w-full h-auto aspect-square object-cover" />
            </button>
          ))}
        </div>
      )}

      {activeTab === 'link' && (
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-white/70">{t("settings.pasteImageLink")}</p>
          <div className="flex gap-2">
            <Input 
              placeholder="https://..." 
              value={linkInput} 
              onChange={e => setLinkInput(e.target.value)} 
              className="flex-1"
              onKeyDown={(e) => { if(e.key === 'Enter') handleLinkSubmit(e); }}
            />
            <Button type="button" onClick={handleLinkSubmit}>{t("settings.apply")}</Button>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-white/70">{t("settings.selectImage")}</p>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <Button type="button" variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
            {t("settings.browse")}
          </Button>
        </div>
      )}
    </div>
  );
}
