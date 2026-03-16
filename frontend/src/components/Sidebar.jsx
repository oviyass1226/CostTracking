import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Wallet, X, Cloud, CloudOff } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Expenses', path: '/expenses', icon: ReceiptText },
        { name: 'Budgets', path: '/budgets', icon: Wallet },
        { name: 'Reports', path: '/reports', icon: PieChart },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-text/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="h-14 px-6 flex items-center justify-between border-b border-border">
                    <Link to="/" className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-saas flex items-center justify-center shadow-sm shadow-primary/20">
                            <Wallet size={16} className="text-white" />
                        </div>
                        <span className="text-text">CostTrack</span>
                    </Link>
                    <button className="md:hidden text-text-muted hover:text-text" onClick={toggleSidebar}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 py-6 px-2">
                    <div className="px-4 mb-3">
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider opacity-60">Management</span>
                    </div>
                    <nav className="space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`sidebar-link ${isActive(link.path)}`}
                                    onClick={() => isOpen && toggleSidebar()}
                                >
                                    <Icon className="mr-3" size={18} />
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-border">
                    <div className="px-3 py-3 bg-background rounded-saas border border-border transition-colors duration-500">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight mb-2">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center justify-center p-1 rounded-sm ${isOnline ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>
                                {isOnline ? <Cloud size={12} /> : <CloudOff size={12} />}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-success' : 'text-error'}`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                                <span className="text-[9px] font-bold text-text-muted leading-none mt-0.5">
                                    {isOnline ? 'Cloud Sync Active' : 'Local Mode Only'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
