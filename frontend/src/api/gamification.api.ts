import { API_BASE_URL } from "../config/api";

export type GamificationStats = {
	id: string;
	streak_count: number;
	xp_points: number;
	level: number;
	reward_date: string;
	user_id: string;
};

export type GamificationRewardResponse = {
	rewardGiven: boolean;
	xpEarned: number;
	stats: GamificationStats;
};

export type LeaderboardEntry = {
	id: string;
	username: string;
	avatar_url: string | null;
	elo_rating: number;
};

export async function getMyGamificationStats(): Promise<GamificationStats> {
	const response = await fetch(`${API_BASE_URL}/gamification/me`, {
		method: 'GET',
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Gamification stats request failed');
	}

	return response.json();
}

export async function getUserGamificationStats(userId: string): Promise<GamificationStats> {
	const response = await fetch(`${API_BASE_URL}/gamification/users/${userId}`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error('User gamification stats request failed');
	}

	return response.json();
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
	const response = await fetch(`${API_BASE_URL}/gamification/leaderboard`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error('Leaderboard request failed');
	}

	return response.json();
}
