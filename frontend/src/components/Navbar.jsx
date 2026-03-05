import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar p-4 mb-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
                    ExpenseTracker
                </Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/" className="nav-link">Dashboard</Link>
                            <Link to="/expenses" className="nav-link">Expenses</Link>
                            <Link to="/budgets" className="nav-link">Budgets</Link>
                            <Link to="/reports" className="nav-link">Reports</Link>
                            <button onClick={handleLogout} className="nav-link text-danger">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
