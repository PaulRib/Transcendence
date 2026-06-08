import { useAuth } from "./AuthContext";
import { Outlet, Navigate } from "react-router-dom";

export function GuestRoute() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (currentUser) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}