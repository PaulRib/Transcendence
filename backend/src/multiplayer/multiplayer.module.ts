import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MultiplayerGateway } from './multiplayer.gateway';
import { MultiplayerService } from './multiplayer.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChampionsModule } from '../champions/champions.module';
import { InfinitematchesModule } from '../infinitematches/infinitematches.module';
import { MultiplayerController } from './multiplayer.controller';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
		ChampionsModule,
		InfinitematchesModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    controllers: [MultiplayerController],
    providers: [MultiplayerGateway, MultiplayerService],
})
export class MultiplayerModule {}