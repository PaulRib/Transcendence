import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SocialGateway } from "./social.gateway";
import { UsersModule } from "../users/users.module";
import { ChatModule } from "../chat/chat.module";
import { FriendsModule } from "../friends/friends.module";
import { MultiplayerModule } from "../multiplayer/multiplayer.module";
import { SocialEventsModule } from "./social-events.module";

@Module({
    imports: [
        UsersModule,
        FriendsModule,
        ChatModule,
        MultiplayerModule,
        SocialEventsModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [SocialGateway],
})
export class SocialeModule {}
