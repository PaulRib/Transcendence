import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
	constructor(private readonly gamificationService: GamificationService) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	getMyStats(@Request() request) {
		return this.gamificationService.getOrCreateStats(request.user.sub);
	}

	@Post('win')
	@UseGuards(JwtAuthGuard)
	rewardWin(
		@Request() request,
		@Body('attempts') attempts: number, 
	) {
		return this.gamificationService.rewardWin(request.user.sub, attempts);
	}

	@Get('leaderboard')
	getLeaderboard() {
		return this.gamificationService.getLeaderboard();
	}
}