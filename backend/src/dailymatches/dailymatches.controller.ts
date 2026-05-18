import { Controller, Get } from '@nestjs/common';
import { DailymatchesService } from './dailymatches.service'; 

@Controller('dailyMatches')
export class DailymatchesController {
  constructor(private dailymatchesService: DailymatchesService) {}
 
 @Get('champ') // Endpoint: GET /champ
  async getDailyChampion() {
	return this.dailymatchesService.selectDayChamp();
}
}