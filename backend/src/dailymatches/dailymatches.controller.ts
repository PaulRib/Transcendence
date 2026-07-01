import { Controller, Get, Post, Body } from '@nestjs/common';
import { DailymatchesService } from './dailymatches.service'; 

@Controller('dailyMatches')
export class DailymatchesController {
  constructor(private dailymatchesService: DailymatchesService) {}
 
 @Get('champ') // Endpoint: GET /champ
  async getDailyChampion() {
	return this.dailymatchesService.selectDayChamp();
}
  @Post('guess')
   async verifyGuess(@Body('name') guessName: string) {
	return this.dailymatchesService.verifyGuess(guessName);
   }
   @Get('data')
   	async getDailyData() {
		return this.dailymatchesService.getDailyData();
	}
}