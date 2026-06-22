import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: '1h',
			},
		}),
	],
	controllers: [GamificationController],
	providers: [GamificationService],
})
export class GamificationModule {}