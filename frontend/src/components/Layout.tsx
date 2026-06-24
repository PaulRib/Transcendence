import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import DynamicBackground from './DynamicBackground';
import logoUrl from '../assets/logo/logo.png';
import { useAuth } from '../auth/AuthContext';
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { GlobalChat } from './GlobalChat';
import { useGameUniverse } from '../context/GameUniverseContext';
import { Globe, Swords, User } from 'lucide-react';

function Layout() {
    const { currentUser, isLoading, logout } = useAuth();
    const { universe, toggleUniverse } = useGameUniverse();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const handleToggleUniverse = () => {
        toggleUniverse();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            <DynamicBackground />
            
            <header className="px-6 py-4 border-b border-white/20 bg-[#1d1d20]/33 backdrop-blur-md flex justify-between items-center relative z-[999]">
                <nav className="flex justify-center items-center gap-4">
                    <Link to="/" className="p-0 flex items-center bg-transparent group">
                        <img 
                            src={logoUrl} 
                            alt="Logo Transcendence" 
                            className="h-[75px] w-auto object-contain my-[-15px] transition-transform duration-200 group-hover:scale-105" 
                        />
                    </Link>
                </nav>
                
                <div className="auth-nav">
                    {isLoading ? null : currentUser ? (
                        <div className="relative flex items-center" ref={dropdownRef}>
                            <Button 
                                variant="outline"
                                className="rounded-full w-12 h-12 p-0 overflow-hidden border-2 border-white/20 hover:border-white/50 transition-colors" 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={currentUser.avatar_url || undefined} />
                                    <AvatarFallback>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                            </Button>
                            
                            <div className={`absolute top-[50px] right-0 bg-[#1d1d20] border border-white/10 rounded-lg py-2 min-w-[150px] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex flex-col z-[100] transition-all duration-200 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                                <Link className="px-4 py-3 text-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/profile" onClick={() => setIsDropdownOpen(false)}>Mon Profil</Link>
                                <Link className="px-4 py-3 text-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/friends" onClick={() => setIsDropdownOpen(false)}>Liste d'amis</Link>
                                <Link className="px-4 py-3 text-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/leaderboard" onClick={() => setIsDropdownOpen(false)}>Classement</Link>
                                <Link className="px-4 py-3 text-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/settings" onClick={() => setIsDropdownOpen(false)}>Paramètres</Link>
                                <div className="h-[1px] bg-white/10 my-2"></div>
                                <Button variant="ghost" className="w-full justify-start rounded-none text-sm font-normal px-4 py-3 h-auto hover:bg-white/10" onClick={handleLogout}>Se déconnecter</Button>
                            </div>
                        </div>
                    ) : (
                        <Button 
                            onClick={() => navigate('/login')} 
                            variant="default"
                            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
                        >
                            <User size={18} />
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex justify-center min-h-0">
                <main className="p-8 md:p-6 flex justify-center items-start w-full">
                    <Outlet />
                </main>
            </div>
            <GlobalChat />

            {/* Bouton pour changer d'univers */}
            <div className="fixed bottom-6 left-6 z-[1000]">
                <Button 
                    variant="outline" 
                    className="rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-[#1d1d20]/80 backdrop-blur-md h-12 px-6 border-white/20 hover:bg-white/10"
                    onClick={handleToggleUniverse}
                >
                    {universe === 'league' ? (
                        <><Globe size={18} className="mr-2 text-blue-400" /> Mode Country</>
                    ) : (
                        <><Swords size={18} className="mr-2 text-yellow-400" /> Mode League</>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default Layout;