import { Injectable } from "@nestjs/common";
import { Namespace } from "socket.io";

@Injectable()
export class SocialEventsService {
    private server: Namespace | null = null;

    setServer(server: Namespace) {
        this.server = server;
    }

    emitFriendsChanged(userIds: string[]) {
        for (const userId of userIds) {
            this.server?.to(`user:${userId}`).emit('friends_changed');
        }
    }
}
