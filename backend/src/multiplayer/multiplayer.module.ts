import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MultiplayerGateway } from './multiplayer.gateway';
import { MultiplayerService } from './multiplayer.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [MultiplayerGateway, MultiplayerService],
})
export class MultiplayerModule {}