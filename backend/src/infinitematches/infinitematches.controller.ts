import { Controller, Get, Post, Body } from '@nestjs/common';
import { InfinitematchesService } from './infinitematches.service';

@Controller('infiniteMatches')
export class InfinitematchesController {
  constructor(
	private readonly infiniteMatchesService: InfinitematchesService,
  ) {}
 
 @Get('random')
  async getRandomChampion() {
	return this.infiniteMatchesService.getRandomChamp();
}
  @Post('guess')
  async verifyInfiniteGuess(
    @Body('guessName') guessName: string,
    @Body('targetId') targetId: string
  ) {
    return this.infiniteMatchesService.verifyInfiniteGuess(guessName, targetId);
  }
}