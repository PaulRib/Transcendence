import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useAuth } from "@/auth/AuthContext";

type SocialSocketContextValue = {
    socket: Socket | null;
};

type SocialSocketProviderProps = {
    children: ReactNode;
};

const SocialSocketContext = createContext<SocialSocketContextValue | undefined>(undefined);

export function SocialSocketProvider({ children }: SocialSocketProviderProps) {
    const { currentUser, isLoading } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (isLoading || !currentUser) {
            return;
        }

        const token = localStorage.getItem('access_token');

        if (!token) {
            return;
        }

        const socialSocket = io(`${window.location.origin}/social`, {
            path: '/ws',
            auth: { token },
        });

        setSocket(socialSocket);

        return () => {
            socialSocket.disconnect();
            setSocket(null);
        };
    }, [currentUser, isLoading]);

    return (
        <SocialSocketContext.Provider value={{ socket }}>
            {children}
        </SocialSocketContext.Provider>
    );
}

export function useSocialSocket() {
    const context = useContext(SocialSocketContext);

    if (!context) {
        throw new Error('useSocialSocket must be used inside SocialSocketProvider');
    }

    return context;
}