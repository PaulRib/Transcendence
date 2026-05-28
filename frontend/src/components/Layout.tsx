import { Link, Outlet } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import DynamicBackground from './DynamicBackground';
import logoUrl from '../assets/logo/logo.png';

function Layout() {
    // Variable pour simuler la connexion (à remplacer par votre logique d'authentification)
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
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
        setIsLoggedIn(false);
        setIsDropdownOpen(false);
        // Ajouter la logique de déconnexion ici (clear tokens, api call, etc.)
    };

    return (
        <div className="app-shell">
            <DynamicBackground />
            <header className="topbar">
                <nav className="nav">
                    <Link to="/" className="nav-logo-link">
                        <img src={logoUrl} alt="Logo Transcendence" className="site-logo" />
                    </Link>
                </nav>
                <div className="auth-nav">
                    {isLoggedIn ? (
                        <div className="user-menu-container" ref={dropdownRef}>
                            <button 
                                className="user-icon-btn" 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                👤
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Mon Profil</Link>
                                    <Link to="/friends" onClick={() => setIsDropdownOpen(false)}>Liste d'amis</Link>
                                    <Link to="/leaderboard" onClick={() => setIsDropdownOpen(false)}>Classement</Link>
                                    <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>Paramètres</Link>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout}>Se déconnecter</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="login_button" onClick={() => setIsLoggedIn(false)}>Login</Link>
                    )}
                </div>
            </header>
            <div className="content-shell">
                <main className="page-content">
                    <Outlet />
                </main>

                {/* <aside className="chat-sidebar">
                    <ChatPanel />
                </aside> */}
            </div>
        </div>
    );
}

export default Layout;
