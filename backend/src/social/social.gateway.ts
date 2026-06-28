import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { ChatService } from "../chat/chat.service";
import { Namespace } from "socket.io";

@WebSocketGateway({ cors: true, namespace: '/social' })
export class SocialGateway implements
OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer();
    server!: Namespace;

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly chatService: ChatService,
    ) {}

    async handleConnection(client: Socket) {
        
    }

    async handleDisconnect(client: Socket) {
        
    }
}