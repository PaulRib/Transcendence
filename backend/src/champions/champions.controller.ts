import { Controller, Get } from '@nestjs/common';
import { ChampionsService } from './champions.service';

@Controller('champions') // Toutes les URLs commenceront par /champions
export class ChampionsController {
  constructor(private readonly championsService: ChampionsService) {}

  @Get('daily') // Endpoint: GET /champions/daily
  async getDailyChampion() {
    return this.championsService.selectDayChamp();
  }

  @Get('names') // Endpoint: GET /champions/names
  async getAllNames() {
    return this.championsService.getAllNames();
  }
}