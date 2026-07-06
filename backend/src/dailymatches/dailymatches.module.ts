import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChampionsModule } from '../champions/champions.module';
import { DailymatchesController } from './dailymatches.controller';
import { DailymatchesService } from './dailymatches.service';
import { GamificationModule } from '../gamification/gamification.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, ChampionsModule, GamificationModule, 	JwtModule.register({
			  secret: process.env.JWT_SECRET,
		  }),],
  controllers: [DailymatchesController],
  providers: [DailymatchesService],
  exports: [DailymatchesService],
})
export class DailymatchesModule {}