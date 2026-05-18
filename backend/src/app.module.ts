import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChampionsModule } from './champions/champions.module';
import { DailymatchesModule } from './dailymatches/dailymatches.module';

@Module({
  imports: [HealthModule, UsersModule, PrismaModule, ChampionsModule, DailymatchesModule],
})
export class AppModule {}
