import { Link, Outlet } from 'react-router-dom';
import DynamicBackground from './DynamicBackground';

function Layout() {
    return (
        <div className="app-shell">
            <DynamicBackground />
            <header className="topbar">
                <nav className="nav">
                    <Link to="/">Home</Link>
                    <Link to="/profile">Profil</Link>
                </nav>
                <div className="auth-nav">
                    <Link to="/login" className="login_button">Login</Link>
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
