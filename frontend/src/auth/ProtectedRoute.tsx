<<<<<<< HEAD
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
=======
import { useAuth } from "./AuthContext";
import { Outlet, Navigate } from "react-router-dom";

export function ProtectedRoute() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return null;
>>>>>>> main
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

<<<<<<< HEAD
    return <>{children}</>;
}
=======
    return <Outlet />;
}
>>>>>>> main
