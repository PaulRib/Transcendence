import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { CountriesModule } from '../countries/countries.module';
import { DailycountrymatchesController } from './dailycountrymatches.controller';
import { DailycountrymatchesService } from './dailycountrymatches.service';

@Module({
  imports: [PrismaModule, CountriesModule],
  controllers: [DailycountrymatchesController],
  providers: [DailycountrymatchesService],
})
export class DailycountrymatchesModule {}