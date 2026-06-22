import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChampionsModule } from './champions/champions.module';
import { DailymatchesModule } from './dailymatches/dailymatches.module';
import { InfinitematchesModule } from './infinitematches/infinitematches.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [HealthModule, UsersModule, PrismaModule, ChampionsModule, DailymatchesModule, InfinitematchesModule, AuthModule, GamificationModule],
})
export class AppModule {}
