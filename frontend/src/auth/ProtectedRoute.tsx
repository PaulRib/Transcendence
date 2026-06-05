import { useAuth } from "./AuthContext";
import { Outlet, Navigate } from "react-router-dom";

export function ProtectedRoute() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}