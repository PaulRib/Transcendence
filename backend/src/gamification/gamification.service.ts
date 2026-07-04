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

		const newXpPoints = stats.xp_points + xpEarned;

		const updatedStats = await this.prisma.daily_Reward.update({
			where: { user_id: userId },
			data: {
				xp_points: newXpPoints,
				level: this.calculateLevel(newXpPoints),
				streak_count: newStreakCount,
				reward_date: today,
			},
		});

		return {
			rewardGiven: true,
			xpEarned,
			stats: updatedStats,
		};
	}

	async updateRankedElo(winnerId: string, loserId: string) {
		const [winner, loser] = await Promise.all([
			this.prisma.user.findUnique({
				where: { id: winnerId },
				select: { elo_rating: true },
			}),
			this.prisma.user.findUnique({
				where: { id: loserId },
				select: { elo_rating: true },
			}),
		]);

		if (!winner || !loser) {
			throw new Error('Impossible de trouver les joueurs');
		}

		const eloChange = 20;

		await this.prisma.$transaction([
			this.prisma.user.update({
				where: { id: winnerId },
				data: {
					elo_rating: winner.elo_rating + eloChange,
					ranked_wins: {
						increment: 1,
					}
				},
			}),
			this.prisma.user.update({
				where: { id: loserId },
				data: {
					elo_rating: Math.max(loser.elo_rating - eloChange, 0),
					ranked_losses: {
						increment: 1,
					}
				},
			}),
		]);
	}

	async updateDrawElo(playerIds: string[]) {
		if (playerIds.length === 0) {
			return;
		}

		await this.prisma.user.updateMany({
			where: {
				id: { in: playerIds },
			},
			data: {
				elo_rating: {
					increment: 10,
				},
			},
		});
	}

	async getLeaderboard() {
		return this.prisma.user.findMany({
			orderBy: {
				elo_rating: 'desc',
			},
			take: 10,
			select: {
				id: true,
				username: true,
				avatar_url: true,
				elo_rating: true,
			},
		});
	}
}
