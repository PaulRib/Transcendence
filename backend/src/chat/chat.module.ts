import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports: [PrismaModule, JwtModule.register({
        secret: process.env.JWT_SECRET,
        }),
    ],
    controllers: [ChatController],
    providers: [ChatService],
    exports: [ChatService],
})
export class ChatModule {}