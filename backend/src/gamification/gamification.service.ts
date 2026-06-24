import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GamificationService {
	constructor(private readonly prisma: PrismaService) {}

	private calculateLevel(xpPoints: number): number {
		return Math.floor(xpPoints / 100) + 1;
	}

	private isSameDay(firstDate: Date, secondDate: Date): boolean {
		return firstDate.getFullYear() === secondDate.getFullYear()
			&& firstDate.getMonth() === secondDate.getMonth()
			&& firstDate.getDate() === secondDate.getDate();
	}

	private isYesterday(firstDate: Date, secondDate: Date): boolean {
		const yesterday = new Date(secondDate);
		yesterday.setDate(yesterday.getDate() - 1);

		return this.isSameDay(firstDate, yesterday);
	}

	async getOrCreateStats(userId: string) {
		const existingStats = await this.prisma.daily_Reward.findUnique({
			where: { user_id: userId },
		});

		if (existingStats) {
			return existingStats;
		}

		return this.prisma.daily_Reward.create({
			data: {
				user_id: userId,
				level: 1,
				reward_date: new Date(0),
			},
		});
	}

	async rewardWin(userId: string, attempts: number) {
		const stats = await this.getOrCreateStats(userId);
		const today = new Date();

		if (this.isSameDay(stats.reward_date, today)) {
			return {
				rewardGiven: false,
				xpEarned: 0,
				pointsEarned: 0,
				stats,
			};
		}

		const newStreakCount = this.isYesterday(stats.reward_date, today)
			? stats.streak_count + 1
			: 1;

		const safeAttempts = Number.isFinite(attempts) && attempts > 0
			? Math.floor(attempts)
			: 10;

		const attemptXp = Math.max(110 - safeAttempts * 10, 10);
		const streakBonus = Math.min((newStreakCount - 1) * 10, 50);
		const xpEarned = Math.min(attemptXp + streakBonus, 100);
		const pointsEarned = 50;

		const newXpPoints = stats.xp_points + xpEarned;
		const newPointsEarned = stats.points_earned + pointsEarned;

		const updatedStats = await this.prisma.daily_Reward.update({
			where: { user_id: userId },
			data: {
				xp_points: newXpPoints,
				points_earned: newPointsEarned,
				level: this.calculateLevel(newXpPoints),
				streak_count: newStreakCount,
				reward_date: today,
			},
		});

		return {
			rewardGiven: true,
			xpEarned,
			pointsEarned,
			stats: updatedStats,
		};
	}

	async getLeaderboard() {
		return this.prisma.daily_Reward.findMany({
			orderBy: {
				elo_rating: 'desc',
			},
			take: 10,
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatar_url: true,
					},
				},
			},
		});
	}
}
