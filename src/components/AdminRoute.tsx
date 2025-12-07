import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute() {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (!isAuthenticated || !user?.is_superuser) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
