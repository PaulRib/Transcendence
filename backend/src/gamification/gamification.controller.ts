import { BadRequestException, Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
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

	@Get('users/:userId')
	getUserStats(@Param('userId') userId: string) {
		if (!userId || typeof userId !== 'string') {
			throw new BadRequestException('Invalid user id');
		}
		return this.gamificationService.getOrCreateStats(userId);
	}

	@Get('leaderboard')
	getLeaderboard() {
		return this.gamificationService.getLeaderboard();
	}
}
