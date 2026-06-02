import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from 'react';
import { getCurrentUser } from "../api/auth.api";
import type { AuthUser } from "../api/auth.api";

type AuthContextValue = {
    currentUser: AuthUser | null;
    isLoading: boolean;
    login: (user: AuthUser, token: string) => void;
    logout: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (user: AuthUser, token: string) => {
        localStorage.setItem('access_token', token);
        setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setCurrentUser(null);
    };

    useEffect(() => {
        async function loadCurrentUser() {
            const token = localStorage.getItem('access_token');

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const user = await getCurrentUser(token);
                setCurrentUser(user);
            } catch {
                localStorage.removeItem('access_token');
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadCurrentUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}