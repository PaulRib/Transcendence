import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from 'react';
import { getCurrentUser } from "../api/auth.api";
import type { AuthUser } from "../api/auth.api";

type AuthContextValue = {
    currentUser: AuthUser | null;
    isLoading: boolean;
    login: (user: AuthUser, token: string) => void;
    logout: () => void;
    updateCurrentUser: (user: AuthUser) => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = useCallback((user: AuthUser, token: string) => {
        localStorage.setItem('access_token', token);
        setCurrentUser(user);
        setIsLoading(false);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        setCurrentUser(null);
        setIsLoading(false);
    }, []);

    // A VOIR 
    const updateCurrentUser = useCallback((user: AuthUser) => {
        setCurrentUser(user);
    }, []);

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
                updateCurrentUser,
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
