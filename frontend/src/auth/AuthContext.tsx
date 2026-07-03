import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from 'react';
import { getCurrentUser, logoutUser } from "../api/auth.api";
import type { AuthUser } from "../api/auth.api";

type AuthContextValue = {
    currentUser: AuthUser | null;
    isLoading: boolean;
    login: (user: AuthUser) => void;
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

    const login = useCallback((user: AuthUser) => {
        setCurrentUser(user);
        setIsLoading(false);
    }, []);

    const logout = useCallback(async() => {
        try {
            window.dispatchEvent(new Event('auth:logout'));
            await logoutUser();
        } catch (error) {
            console.error("Failed to logout backend session:", error);
        } finally {
            setCurrentUser(null);
            setIsLoading(false);
        }
    }, []);

    // A VOIR 
    const updateCurrentUser = useCallback((user: AuthUser) => {
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch {
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
