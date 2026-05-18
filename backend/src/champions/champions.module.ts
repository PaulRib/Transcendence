import { Module } from '@nestjs/common';
import { ChampionsService } from './champions.service';
import { ChampionsController } from './champions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChampionsController],
  providers: [ChampionsService],
  exports: [ChampionsService],
})
export class ChampionsModule {}