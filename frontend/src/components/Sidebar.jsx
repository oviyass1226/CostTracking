import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
                        ExpenseTracker
                    </h1>
                </div>

                <nav className="flex-1 py-4 space-y-1">
                    <Link to="/" className={`sidebar-link ${isActive('/')}`}>
                        Dashboard
                    </Link>
                    <Link to="/expenses" className={`sidebar-link ${isActive('/expenses')}`}>
                        Expenses
                    </Link>
                    <Link to="/budgets" className={`sidebar-link ${isActive('/budgets')}`}>
                        Budgets
                    </Link>
                    <Link to="/reports" className={`sidebar-link ${isActive('/reports')}`}>
                        Reports
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="text-xs text-center text-gray-500">
                        &copy; 2026 CostApp
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
