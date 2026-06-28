import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { FriendsService } from "../friends/friends.service";
import { ChatService } from "../chat/chat.service";
import { Namespace, Socket } from "socket.io";

@WebSocketGateway({ cors: true, namespace: '/social' })
export class SocialGateway implements
OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Namespace;
    private readonly connectedUsers = new Map<string, number>();

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly chatService: ChatService,
        private readonly friendsService: FriendsService,
    ) {}

    async handleConnection(client: Socket) {
        const token = client.handshake.auth?.token;

        if(!token) {
            client.disconnect();
            return;
        }

        let payload: { sub: string; username: string; };

        try {
            payload = await this.jwtService.verifyAsync(token);
        } catch {
            client.disconnect();
            return;
        }

        await this.usersService.getUserById(payload.sub);
        client.data.userId = payload.sub;
        client.join(`user:${payload.sub}`);
        const currentConnections = this.connectedUsers.get(payload.sub) ?? 0;
        if (currentConnections === 0) {
            await this.usersService.updateOnlineStatus(payload.sub, true);
            await this.notifyFriendsStatus(payload.sub, true);
        }
        this.connectedUsers.set(payload.sub, currentConnections + 1);
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
            await this.usersService.updateOnlineStatus(userId, false);
            await this.notifyFriendsStatus(userId, false);
            return;
        }

        this.connectedUsers.set(userId, nextConnections);
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