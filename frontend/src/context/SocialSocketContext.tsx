import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useAuth } from "@/auth/AuthContext";

type SocialSocketContextValue = {
    socket: Socket | null;
    pendingGameInvite: GameInvite | null;
    acceptedGameInvite: AcceptedGameInvite | null;
    gameInviteError: string | null;
    sendGameInvite: (receiverId: string) => void;
    acceptGameInvite: (inviterId: string) => void;
    clearPendingGameInvite: () => void;
    clearAcceptedGameInvite: () => void;
    clearGameInviteError: () => void;
};

type SocialSocketProviderProps = {
    children: ReactNode;
};

type GameInvite = {
    inviterId: string;
    inviterUsername: string;
    inviterAvatarUrl: string | null;
};

type AcceptedGameInvite = {
    matchId: string;
    opponentId: string;
};

const SocialSocketContext = createContext<SocialSocketContextValue | undefined>(undefined);

export function SocialSocketProvider({ children }: SocialSocketProviderProps) {
    const { currentUser, isLoading } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [pendingGameInvite, setPendingGameInvite] = useState<GameInvite | null>(null);
    const [acceptedGameInvite, setAcceptedGameInvite] = useState<AcceptedGameInvite | null>(null);
    const [gameInviteError, setGameInviteError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading || !currentUser) {
            return;
        }

        const socialSocket = io(`${window.location.origin}/social`, {
            path: '/ws',
            withCredentials: true,
        });

        function handleAuthLogout() {
            socialSocket.emit('logout');
        }

        window.addEventListener('auth:logout', handleAuthLogout);
        setSocket(socialSocket);

        return () => {
            window.removeEventListener('auth:logout', handleAuthLogout);
            socialSocket.disconnect();
            setSocket(null);
        };
    }, [currentUser, isLoading]);

    useEffect(() => {
        if(!socket) {
            return;
        }

        function handleGameInviteReceived(invite: GameInvite) {
            setPendingGameInvite(invite);
            setGameInviteError(null);
        }

        function handleGameInviteAccepted(invite: AcceptedGameInvite) {
            setAcceptedGameInvite(invite);
            setPendingGameInvite(null);
            setGameInviteError(null);
        }

        function handleGameInviteError(error: { message: string }) {
            setGameInviteError(error.message);
        }

        socket.on('game_invite_received', handleGameInviteReceived);
        socket.on('game_invite_accepted', handleGameInviteAccepted);
        socket.on('game_invite_error', handleGameInviteError);

        return () => {
            socket.off('game_invite_received', handleGameInviteReceived);
            socket.off('game_invite_accepted', handleGameInviteAccepted);
            socket.off('game_invite_error', handleGameInviteError);
        };
    }, [socket]);

    function sendGameInvite(receiverId: string) {
        if (!socket) {
            return;
        }

        socket.emit('send_game_invite', { receiverId });
    }

    function acceptGameInvite(inviterId: string) {
        if (!socket) {
            return;
        }

        socket.emit('accept_game_invite', { inviterId });
    }

    function clearPendingGameInvite() {
        setPendingGameInvite(null);
    }

    function clearAcceptedGameInvite() {
        setAcceptedGameInvite(null);
    }

    function clearGameInviteError() {
        setGameInviteError(null);
    }

    return (
        <SocialSocketContext.Provider value={{ 
            socket,
            pendingGameInvite,
            acceptedGameInvite,
            gameInviteError,
            sendGameInvite,
            acceptGameInvite,
            clearPendingGameInvite,
            clearAcceptedGameInvite, 
            clearGameInviteError,
            }}>
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
