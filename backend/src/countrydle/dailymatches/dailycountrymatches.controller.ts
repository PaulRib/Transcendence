import { Controller, Get, Post, Body } from '@nestjs/common';
import { DailycountrymatchesService } from './dailycountrymatches.service';

@Controller('dailyCountryMatches')
export class DailycountrymatchesController {
  constructor(private dailycountrymatchesService: DailycountrymatchesService) {}

  @Get('country')
  async getDailyCountry() {
    return this.dailycountrymatchesService.selectDayCountry();
  }

  @Post('guess')
  async verifyGuess(@Body('name') guessName: string) {
    return this.dailycountrymatchesService.verifyGuess(guessName);
  }
}