import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChampionsModule } from '../champions/champions.module';
import { InfinitematchesController } from './infinitematches.controller';
import { InfinitematchesService } from './infinitematches.service';

@Module({
  imports: [PrismaModule, ChampionsModule],
  controllers: [InfinitematchesController],
  providers: [InfinitematchesService],
  exports: [InfinitematchesService],
})
export class InfinitematchesModule {}