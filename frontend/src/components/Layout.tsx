import { Link, Outlet } from 'react-router-dom';
import ChatPanel from './ChatPanel';

function Layout() {
    return (
        <div className="app-shell">
            <header className="topbar">
                <nav className="nav">
                    <Link to="/">Home</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/login">Login</Link>

                </nav>
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
