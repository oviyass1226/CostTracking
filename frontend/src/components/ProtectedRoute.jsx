import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
