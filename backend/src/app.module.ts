import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChampionsModule } from './champions/champions.module';
import { DailymatchesModule } from './dailymatches/dailymatches.module';

@Module({
  imports: [HealthModule, UsersModule, AuthModule,PrismaModule, ChampionsModule, DailymatchesModule],
})
export class AppModule {}
