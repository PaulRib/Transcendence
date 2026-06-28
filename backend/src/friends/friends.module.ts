import { Module } from "@nestjs/common";
import { FriendsController } from "./friends.controller";
import { FriendsService } from "./friends.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        PrismaModule, 
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: '1h'
        },
    })],
    controllers: [FriendsController],
    providers: [FriendsService],
    exports: [FriendsService],
})
export class FriendsModule {}