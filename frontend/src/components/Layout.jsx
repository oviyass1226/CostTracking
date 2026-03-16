import { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AuthContext from '../context/AuthContext';
import { Menu, LogOut, User as UserIcon, Bell, X, UserCog } from 'lucide-react';

const Layout = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openEditProfile = () => {
        setIsProfileOpen(false);
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        // Update context and localStorage
        updateUser({ username, email });
        setIsEditOpen(false);
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="main-wrapper">
                <header className="topbar">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-1.5 hover:bg-surface-hover rounded text-text-muted transition-colors"
                            onClick={toggleSidebar}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-sm font-semibold text-text-muted hidden sm:block">
                            Dashboard / <span className="text-text font-bold">{window.location.pathname.substring(1) || 'Home'}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 text-text-muted hover:text-primary transition-colors">
                            <Bell size={18} />
                        </button>

                        <div className="h-6 w-px bg-border mx-1"></div>

                        <div className="relative">
                            <div 
                                onClick={toggleProfileMenu}
                                className="flex items-center gap-3 pl-2 group cursor-pointer"
                                title="System User"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-text leading-tight">{user?.username}</p>
                                    <p className="text-[10px] text-primary font-bold leading-tight uppercase tracking-tighter">Pro Partner</p>
                                </div>
                                <div className={`w-8 h-8 rounded-saas bg-background border border-border flex items-center justify-center transition-all duration-300 ${isProfileOpen ? 'bg-primary text-white' : 'text-primary group-hover:bg-primary/5'}`}>
                                    <UserIcon size={16} />
                                </div>
                            </div>

                            {/* DROPDOWN MENU */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-saas shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-border bg-background/50">
                                            <p className="text-[11px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Session Owner</p>
                                            <p className="text-xs font-bold text-text truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <button 
                                                onClick={openEditProfile}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-text-muted hover:text-primary hover:bg-primary/5 rounded-saas transition-all"
                                            >
                                                <UserCog size={14} /> Edit Profile
                                            </button>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-error hover:bg-error/5 rounded-saas transition-all"
                                            >
                                                <LogOut size={14} /> Log Out System
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="content-area">
                    <Outlet />
                </main>

                {/* EDIT PROFILE MODAL */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-text/40 backdrop-blur-sm flex items-center justify-center z-100 animate-in fade-in duration-300">
                        <div className="card w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                                <div className="flex items-center gap-2">
                                    <UserCog size={16} className="text-primary" />
                                    <h3 className="text-[11px] font-black text-text uppercase tracking-widest">Update Identity</h3>
                                </div>
                                <button 
                                    onClick={() => setIsEditOpen(false)}
                                    className="p-1 text-text-muted hover:text-text transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="label">Public Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input-field font-bold"
                                        placeholder="Enter new username"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="label">Registered Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field font-bold"
                                        placeholder="Enter new email"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button 
                                        onClick={() => setIsEditOpen(false)}
                                        className="btn-secondary flex-1 py-2.5 font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Ignore Changes
                                    </button>
                                    <button 
                                        onClick={handleUpdate}
                                        className="btn-primary flex-1 py-2.5 font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;