import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from "../i18n/LanguageContext";

const DEFAULT_AVATARS = [
  "https://cdn.intra.42.fr/users/3bf69c389f36c86e822b07a0167b858c/lsaiti.jpg",
  "https://imgs.search.brave.com/4hDEl5in3OA3yLTcFiMmP0_7468q98SxyfQ3PMN5G1Y/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDEwMzkw/NzEzLmpwZw",
  "https://imgs.search.brave.com/bDfFpfF7eLNSESYDB78NGjA_NI0kapz0cr-Tqs-TymM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL2ZyZWUv/cG5nLTI1Ni9mcmVl/LWxpbnV4LWljb24t/c3ZnLWRvd25sb2Fk/LXBuZy0xMTc0OTI4/LnBuZz9mPXdlYnAm/dz0xMjg",
  "https://imgs.search.brave.com/F_9QEoAJHQOY4nKaoVnEiS8AUxk8GjO-Zojcvy6kUVI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3RpL3Bob3Rv/cy1ncmF0dWl0ZS90/Mi8yMjc3OTMzMy1h/c3Ryb25hdXRlLWRh/bnMtZXNwYWNlLWNv/bnRleHRlLWlsbHVz/dHJhdGlvbi1haS1n/ZW5lcmF0aWYtZ3Jh/dHVpdC1waG90by5q/cGc",
  "https://imgs.search.brave.com/po_GZ3pT18pVUiSyps6Px0hxng-J8irjogEhNDZ2_NY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/MzUzODI2NTE5MjEt/NWU3N2VhNDQ1OGYy/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZhdXRv/PWZvcm1hdCZmaXQ9/Y3JvcCZpeGxpYj1y/Yi00LjEuMCZpeGlk/PU0zd3hNakEzZkRC/OE1IeHpaV0Z5WTJo/OE1qQjhmR3hoYldK/dmNtZG9hVzVwSlRJ/d2QyRnNiSEJoY0dW/eWZHVnVmREI4ZkRC/OGZId3c",
  "https://imgs.search.brave.com/sqnWnqMWpvnNSAM7w98IbJsDr8jfQGPs22dhuztZPnE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTA3/NjAzMjM4Mi9mci9w/aG90by9mZXJyYXJp/LWxhZmVycmFyaS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/ajhmRFdEZElkTnVY/b3lYR2haRTlQZ2lO/bzg5Q0FPNVJwRWxl/RVRYWTYyUT0",
];

type AvatarPickerProps = {
  currentAvatar: string | null;
  onAvatarChange: (newAvatar: string | null) => void;
  onValidate: () => void;
};

export function AvatarPicker({ currentAvatar, onAvatarChange, onValidate }: AvatarPickerProps) {
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
      
      <div className="flex justify-center pt-4 mt-2 border-t border-white/10">
        <Button type="button" onClick={onValidate} className="px-8">
          {t("settings.save")}
        </Button>
      </div>
    </div>
  );
}
