import { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AuthContext from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="main-wrapper">
                <header className="topbar">
                    <button
                        className="md:hidden text-white"
                        onClick={toggleSidebar}
                    >
                        ☰
                    </button>

                    <h2 className="text-lg font-semibold hidden md:block">
                        Welcome, {user?.username}
                    </h2>

                    <button onClick={handleLogout} className="btn-primary w-auto px-4 py-2 text-sm bg-red-600 hover:bg-red-700 border-none">
                        Logout
                    </button>
                </header>

                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
