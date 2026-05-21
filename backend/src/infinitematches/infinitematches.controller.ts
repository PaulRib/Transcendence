import { Controller, Get, Post, Body } from '@nestjs/common';
import { InfinitematchesService } from './infinitematches.service'; 
import { DailymatchesService } from '../dailymatches/dailymatches.service';

@Controller('infiniteMatches')
export class InfinitematchesController {
  constructor(
	private readonly infiniteMatchesService: InfinitematchesService,
    private readonly dailyMatchesService: DailymatchesService // Réutilisation de verifyGuess
  ) {}
 
 @Get('random') // Endpoint: GET /champ
  async getRandomChampion() {
	return this.infiniteMatchesService.getRandomChamp();
}
  @Post('guess')
  async verifyGuess(
    @Body('guessName') guessName: string,
    @Body('secretTargetId') secretTargetId: string // Changement pour la sécurité (voir ci-dessous)
  ) {
    return this.infiniteMatchesService.verifyInfiniteGuess(guessName, secretTargetId);
  }
}