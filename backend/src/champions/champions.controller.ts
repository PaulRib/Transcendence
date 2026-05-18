import { Controller, Get } from '@nestjs/common';
import { ChampionsService } from './champions.service';

@Controller('champions') // Toutes les URLs commenceront par /champions
export class ChampionsController {
  constructor(private readonly championsService: ChampionsService) {}



  @Get('names') // Endpoint: GET /champions/names
  async getAllNames() {
    return this.championsService.getAllNames();
  }

  @Get('name')
  async getChampByName(name: string) {
	return this.championsService.getChampByName(name);
  }

  @Get('exactChamp')
  async getExactChampByName(letter: string) {
	return this.championsService.getExactChampByName(letter);
  }
}