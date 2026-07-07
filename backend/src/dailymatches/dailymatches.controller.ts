import { Request, Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DailymatchesService } from './dailymatches.service'; 
import { JwtService } from '@nestjs/jwt'

@Controller('dailyMatches')
export class DailymatchesController {
  constructor(private dailymatchesService: DailymatchesService, private jwtService: JwtService) {}
 
 @Get('champ') // Endpoint: GET /champ
  async getDailyChampion() {
	return this.dailymatchesService.selectDayChamp();
}

	//verification during guess if user have jwt token to  give daily reward
  @Post('guess')
   async verifyGuess(@Request() request, @Body('attempts') attempts: number, @Body('name') guessName: string) {
	const token = request.cookies?.['access_token'];
	let userId: string | undefined = undefined;
	if (token) {
		try {
			const payload = await this.jwtService.verifyAsync(token); 
            userId = payload.sub;
		}
		catch {
			//if token is invalid or expired, we ignore the error and user play as guest
		}
	}
	return this.dailymatchesService.verifyGuess(guessName, attempts, userId);
   }
   @Get('data')
   	async getDailyData() {
		return this.dailymatchesService.getDailyData();
	}
}