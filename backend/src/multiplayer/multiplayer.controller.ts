import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MultiplayerService } from './multiplayer.service';

@Controller('multiplayer')
export class MultiplayerController {
	constructor(private readonly multiplayerService: MultiplayerService){}

	@Get('history')
	@UseGuards(JwtAuthGuard)
	getMatchHistory(@Request() request) {
		return this.multiplayerService.getMatchHistory(request.user.sub);
	}
}