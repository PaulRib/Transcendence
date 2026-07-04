import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { FriendsService } from "../friends/friends.service";
import { ChatService } from "../chat/chat.service";
import { Namespace, Socket } from "socket.io";
import { MultiplayerService } from "../multiplayer/multiplayer.service";
import { SocialEventsService } from "./social-events.service";

type SendMessagePayload = {
    receiverId: string;
    content: string;
};

type SendGameInvitePayload = {
    receiverId: string;
};

type AcceptGameInvitePayload = {
    inviterId: string;
};

type TypingPayload = {
    receiverId: string;
};

type MarkMessagesReadPayload = {
    otherUserId: string;
};

@WebSocketGateway({ cors:  {origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }, 
                    namespace: '/social' })
export class SocialGateway implements
OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server!: Namespace;
    private readonly connectedUsers = new Map<string, number>();
    private readonly offlineTimeouts = new Map<string, NodeJS.Timeout>();

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly chatService: ChatService,
        private readonly friendsService: FriendsService,
        private readonly multiplayerService: MultiplayerService,
        private readonly socialEventsService: SocialEventsService,
    ) {}

    afterInit() {
        this.socialEventsService.setServer(this.server);
    }

    async handleConnection(client: Socket) {
        try {
            const cookieHeader = client.handshake.headers.cookie;
            const token = cookieHeader
                ?.split(';')
                .find((c) => c.trim().startsWith('access_token='))
                ?.split('=')
                .slice(1)
                .join('=');
     
            if(!token) {
                client.disconnect();
                return;
            }

            const payload: { sub: string; username: string; } = await this.jwtService.verifyAsync(token);

            await this.usersService.getUserById(payload.sub);
            client.data.userId = payload.sub;
            client.join(`user:${payload.sub}`);

            const offlineTimeout = this.offlineTimeouts.get(payload.sub);
            if (offlineTimeout) {
                clearTimeout(offlineTimeout);
                this.offlineTimeouts.delete(payload.sub);
            }

            const currentConnections = this.connectedUsers.get(payload.sub) ?? 0;
            if (currentConnections === 0) {
                await this.usersService.updateOnlineStatus(payload.sub, true);
                await this.notifyFriendsStatus(payload.sub, true);
            }
            this.connectedUsers.set(payload.sub, currentConnections + 1);
        } catch (error) {
            console.error(`Social gateway connection failed: ${error}`);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = client.data.userId;

        if(!userId) {
            return;
        }

        const currentConnections = this.connectedUsers.get(userId) ?? 0;
        const nextConnections = currentConnections - 1;

        if (nextConnections <= 0) {
            this.connectedUsers.delete(userId);

            const offlineTimeout = setTimeout(async () => {
                if (this.connectedUsers.has(userId)) {
                    return;
                }

                this.offlineTimeouts.delete(userId);
                try {
                    await this.usersService.updateOnlineStatus(userId, false);
                    await this.notifyFriendsStatus(userId, false);
                } catch (error) {
                    console.error(`Error updating offline status for user ${userId}:`, error);
                }
            }, 3000);

            this.offlineTimeouts.set(userId, offlineTimeout);
            return;
        }

        this.connectedUsers.set(userId, nextConnections);
    }

    @SubscribeMessage('logout')
    async handleLogout(@ConnectedSocket() client: Socket) {
        const userId = client.data.userId;

        if (!userId) {
            client.disconnect();
            return;
        }

        const offlineTimeout = this.offlineTimeouts.get(userId);
        if (offlineTimeout) {
            clearTimeout(offlineTimeout);
            this.offlineTimeouts.delete(userId);
        }

        this.connectedUsers.delete(userId);
        try {
            await this.usersService.updateOnlineStatus(userId, false);
            await this.notifyFriendsStatus(userId, false);
        } catch (error) {
            console.error(`Error during logout update for user ${userId}:`, error);
        }
        client.disconnect();
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: SendMessagePayload,
    ) {
        const senderId = client.data.userId;

        if (!senderId) {
            client.disconnect();
            return;
        }
		try {
			const createdMessage = await this.chatService.sendMessage(senderId, data.receiverId, data.content);

			client.emit('message_received', createdMessage);

			this.server.to(`user:${data.receiverId}`).emit('message_received', createdMessage);
		}
		catch (error: any) {
			console.error("Erreur dans handleSendMessage :", error);
			client.emit('message_error', {
				receiverId: data.receiverId,
				message: error.message
			});
		}
    }

    @SubscribeMessage('typing_start')
    handleTypingStart(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: TypingPayload,
    ) {
        const senderId = client.data.userId;

        if (!senderId) {
            client.disconnect();
            return;
        }

        this.server.to(`user:${data.receiverId}`).emit('typing_started', {
            userId: senderId,
        });
    }

    @SubscribeMessage('typing_stop')
    handleTypingStop(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: TypingPayload,
    ) {
        const senderId = client.data.userId;

        if (!senderId) {
            client.disconnect();
            return;
        }

        this.server.to(`user:${data.receiverId}`).emit('typing_stopped', {
            userId: senderId,
        });
    }

    @SubscribeMessage('send_game_invite')
    async handleSendGameInvite(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: SendGameInvitePayload,
    ) {
        const inviterId = client.data.userId;

        if (!inviterId) {
            client.disconnect();
            return;
        }

        if (inviterId === data.receiverId) {
            client.emit('game_invite_error', {
                message: "You cannot invite yourself",
            });
            return;
        }

        const areFriends = await this.friendsService.areFriends(inviterId, data.receiverId);

        if (!areFriends) {
            client.emit('game_invite_error', {
                message: "You can only invite your friends",
            });
            return;
        }

        const inviterActiveMatch = await this.multiplayerService.getActiveMatchForUser(inviterId);
        if (inviterActiveMatch) {
            client.emit('game_invite_error', {
                message: "You are already in a game",
            });
            return;
        }

        const receiverActiveMatch = await this.multiplayerService.getActiveMatchForUser(data.receiverId);
        if (receiverActiveMatch) {
            client.emit('game_invite_error', {
                message: "This player is already in a game",
            });
            return;
        }

        const inviter = await this.usersService.getUserById(inviterId);

        this.server.to(`user:${data.receiverId}`).emit('game_invite_received', {
            inviterId,
            inviterUsername: inviter.username,
            inviterAvatarUrl: inviter.avatar_url,
        });

        client.emit('game_invite_sent', {
            receiverId: data.receiverId,
        });
    }

    @SubscribeMessage('accept_game_invite')
    async handleAcceptGameInvite(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: AcceptGameInvitePayload,
    ) {
        const invitedId = client.data.userId;

        if (!invitedId) {
            client.disconnect();
            return;
        }

        if (invitedId === data.inviterId) {
            client.emit('game_invite_error', {
                message: "You cannot accept your own invite",
            });
            return;
        }

        const areFriends = await this.friendsService.areFriends(invitedId, data.inviterId);

        if (!areFriends) {
            client.emit('game_invite_error', {
                message: "You can only accept invites from your friends",
            });
            return;
        }

        const invitedActiveMatch = await this.multiplayerService.getActiveMatchForUser(invitedId);
        if (invitedActiveMatch) {
            client.emit('game_invite_error', {
                message: "You are already in a game",
            });
            return;
        }

        const inviterActiveMatch = await this.multiplayerService.getActiveMatchForUser(data.inviterId);
        if (inviterActiveMatch) {
            client.emit('game_invite_error', {
                message: "This player is already in a game",
            });
            return;
        }

        const match = await this.multiplayerService.createMatch(data.inviterId, invitedId);

        this.server.to(`user:${data.inviterId}`).emit('game_invite_accepted', {
            matchId: match.id,
            opponentId: invitedId,
        });

        this.server.to(`user:${invitedId}`).emit('game_invite_accepted', {
            matchId: match.id,
            opponentId: data.inviterId,
        });

    }

    @SubscribeMessage('mark_message_read')
    async handleMarkMessagesRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: MarkMessagesReadPayload,
    ) {
        const currentUserId = client.data.userId;

        if (!currentUserId){
            client.disconnect();
            return;
        }
        const result = await this.chatService.markConversationAsRead(
            currentUserId,
            data.otherUserId,
        );

        this.server.to(`user:${data.otherUserId}`).emit('message_read', {
            readerId: currentUserId,
            read_at: result.read_at,
        });
    }

    private async notifyFriendsStatus(userId: string, isOnline: boolean) {
        const friendIds = await this.friendsService.getFriendIdsForSocialEvents(userId);

        for (const friendId of friendIds) { // of = prendre chaque element du tableau a la fois (ami 1 puis ami 2 etc ...)
            this.server.to(`user:${friendId}`).emit('friend_status_changed', {
                userId,
                isOnline,
            });
        }
    }
}
