import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import DynamicBackground from './DynamicBackground';
import logoUrl from '../assets/logo/logo.png';
import { useAuth } from '../auth/AuthContext';
import { Button } from "../components/ui/button";

function Layout() {
    const { currentUser, isLoading, logout } = useAuth();
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
                            <button 
                                className="bg-transparent border border-white/20 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer p-0 text-white text-lg transition-colors duration-200 hover:bg-white/10" 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                👤
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute top-[50px] right-0 bg-[#1d1d20] border border-white/10 rounded-lg py-2 min-w-[150px] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex flex-col z-[100]">
                                    <Link className="px-4 py-3 color-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/profile" onClick={() => setIsDropdownOpen(false)}>Mon Profil</Link>
                                    <Link className="px-4 py-3 color-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/friends" onClick={() => setIsDropdownOpen(false)}>Liste d'amis</Link>
                                    <Link className="px-4 py-3 color-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/leaderboard" onClick={() => setIsDropdownOpen(false)}>Classement</Link>
                                    <Link className="px-4 py-3 color-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10" to="/settings" onClick={() => setIsDropdownOpen(false)}>Paramètres</Link>
                                    <div className="h-[1px] bg-white/10 my-2"></div>
                                    <button className="px-4 py-3 color-white text-left w-full cursor-pointer text-sm transition-colors duration-200 hover:bg-white/10 bg-transparent border-none" onClick={handleLogout}>Se déconnecter</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button onClick={() => navigate('/login')} variant="default">login</Button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex justify-center min-h-0">
                <main className="p-8 md:p-6 flex justify-center items-start w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;