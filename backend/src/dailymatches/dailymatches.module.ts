import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChampionsModule } from '../champions/champions.module';
import { DailymatchesController } from './dailymatches.controller';
import { DailymatchesService } from './dailymatches.service';

@Module({
  imports: [PrismaModule, ChampionsModule],
  controllers: [DailymatchesController],
  providers: [DailymatchesService],
  exports: [DailymatchesService],
})
export class DailymatchesModule {}