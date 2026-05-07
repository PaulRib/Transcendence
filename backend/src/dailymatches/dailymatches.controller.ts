import { Controller, Get } from '@nestjs/common';
import { DailymatchesService } from './dailymatches.service'; 
 
export class DailymatchesController {
  constructor(private dailymatchesService: DailymatchesService) {}
 
 @Get('daily') // Endpoint: GET /daily
  async getDailyChampion() {
	return this.dailymatchesService.selectDayChamp();
}
}