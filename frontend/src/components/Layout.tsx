import { Outlet, useNavigate, Link } from 'react-router-dom';
import DynamicBackground from './DynamicBackground';
import logoUrl from '../assets/logo/logo.png';
import { useAuth } from '../auth/AuthContext';
import { Button } from "../components/ui/button";
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { GlobalChat } from './GlobalChat';
import { useGameUniverse } from '../context/GameUniverseContext';
import { Globe, Swords, User, Languages, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Toaster } from './ui/sonner';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from '../components/ui/dropdown-menu';
import { useSocialSocket } from '@/context/SocialSocketContext';
import { useEffect } from 'react';

function Layout() {
    const { currentUser, isLoading, logout } = useAuth();
    const { universe, toggleUniverse, setUniverse } = useGameUniverse();
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const { pendingGameInvite, acceptedGameInvite, acceptGameInvite, clearPendingGameInvite } = useSocialSocket();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleToggleUniverse = () => {
        toggleUniverse();
        navigate('/');
    };

    useEffect(() => {
        if (!acceptedGameInvite) {
            return;
        }
        setUniverse('league');
        navigate('/ranked');
    }, [acceptedGameInvite, navigate, setUniverse]);

    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            <DynamicBackground />

            <header className="px-3 py-3 sm:px-6 sm:py-4 border-b border-white/20 bg-[#1d1d20]/33 backdrop-blur-md flex justify-between items-center relative z-[999]">
                <nav className="flex justify-center items-center gap-4">
                    <Link to="/" className="p-0 flex items-center bg-transparent group">
                        <img
                            src={logoUrl}
                            alt={t("nav.logoAlt")}
                            className="h-[75px] w-auto object-contain my-[-15px] transition-transform duration-200 group-hover:scale-105"
                        />
                    </Link>
                </nav>
                <div className="auth-nav">
                    {isLoading ? null : currentUser ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="group w-10 h-10 flex items-center justify-center cursor-pointer outline-none rounded-full">
                                    <Button
                                        variant="outline"
                                        className="rounded-full w-10 h-10 p-0 text-lg border-white/20 transition-all duration-300 group-hover:scale-110 outline-none focus-visible:ring-0 pointer-events-none"
                                    >
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={currentUser.avatar_url || undefined} />
                                            <AvatarFallback>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#1d1d20] border-white/10 text-white min-w-[160px] mt-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]" align="end">
                                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer py-2.5">
                                    <Link to="/profile">{t("nav.profile")}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer py-2.5">
                                    <Link to="/friends">{t("nav.friends")}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer py-2.5">
                                    <Link to="/match-history">{t("nav.matchHistory")}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer py-2.5">
                                    <Link to="/leaderboard">{t("nav.leaderboard")}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer py-2.5">
                                    <Link to="/settings">{t("nav.settings")}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer py-2.5 text-red-400 focus:text-red-300" onClick={handleLogout}>
                                    {t("nav.logout")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button 
                            onClick={() => navigate('/login')} 
                            variant="default"
                            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110"
                        >
                            <User size={18} />
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex justify-center min-h-0">
                <main className="p-2 sm:p-4 md:p-6 pb-28 md:pb-24 flex justify-center items-start w-full relative z-10 min-w-0">
                    <Outlet />
                </main>
            </div>
            <GlobalChat />

            <div className="fixed bottom-6 left-6 z-[1000] pointer-events-none [&>*]:pointer-events-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="group w-12 h-12 flex items-center justify-center cursor-pointer outline-none rounded-full">
                            <Button
                                variant="outline"
                                className="rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-[#1d1d20]/80 backdrop-blur-md w-12 h-12 p-0 border-white/20 group-hover:bg-white/10 flex items-center justify-center text-white outline-none focus-visible:ring-0 transition-all duration-300 group-hover:scale-110 pointer-events-none"
                            >
                                <Settings size={22} className="text-slate-300" />
                            </Button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1d1d20] border-white/20 text-white min-w-[200px] mb-2" align="start" side="top">
                        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer py-2" onSelect={handleToggleUniverse}>
                            {universe === 'league' ? (
                                <><Globe size={16} className="mr-2 text-blue-400" />{t("nav.countryMode")}</>
                            ) : (
                                <><Swords size={16} className="mr-2 text-yellow-400" />{t("nav.leagueMode")}</>
                            )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="bg-white/10" />

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="hover:bg-white/10 cursor-pointer py-2">
                                <Languages size={16} className="mr-2" />
                                {t("nav.language")}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-[#1d1d20]  text-white ml-2" sideOffset={8}>
                                <DropdownMenuRadioGroup value={language} onValueChange={(val) => setLanguage(val as Language)}>
                                    <DropdownMenuRadioItem value="fr" className="cursor-pointer hover:bg-white/10">Français (FR)</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en" className="cursor-pointer hover:bg-white/10">English (EN)</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="ru" className="cursor-pointer hover:bg-white/10">Русский (RU)</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {pendingGameInvite && (
                <div className="fixed right-6 top-24 z-[1100] w-80 rounded-xl border border-white/10 bg-[#1d1d20] p-4 text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
                    <p className="mb-3 text-sm font-semibold">
                        {t("nav.gameInvitation").replace("{username}", pendingGameInvite.inviterUsername)}
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={clearPendingGameInvite}
                            className="text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                            {t("nav.decline")}
                        </Button>

                        <Button
                            type="button"
                            onClick={() => acceptGameInvite(pendingGameInvite.inviterId)}
                            className="bg-green-600 text-white hover:bg-green-500"
                        >
                            {t("nav.accept")}
                        </Button>
                    </div>
                </div>
            )}

            <Toaster position="top-right" richColors />
        </div>
    );
}

export default Layout;
