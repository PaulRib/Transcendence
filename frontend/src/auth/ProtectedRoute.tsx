import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingScreen from '../components/LoadingScreen';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
