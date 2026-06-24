import { API_BASE_URL } from "../config/api";

export type GamificationStats = {
	id: string;
	streak_count: number;
	points_earned: number;
	xp_points: number;
	level: number;
	elo_rating: number;
	reward_date: string;
	user_id: string;
};

export type GamificationRewardResponse = {
	rewardGiven: boolean;
	xpEarned: number;
	pointsEarned: number;
	stats: GamificationStats;
};

export type LeaderboardEntry = {
	id: string;
	streak_count: number;
	points_earned: number;
	xp_points: number;
	level: number;
	elo_rating: number;
	reward_date: string;
	user_id: string;
	user: {
		id: string;
		username: string;
		avatar_url: string | null;
	};
};

export async function getMyGamificationStats(token: string): Promise<GamificationStats> {
	const response = await fetch(`${API_BASE_URL}/gamification/me`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error('Gamification stats request failed');
	}

	return response.json();
}

export async function rewardWin(token: string, attempts: number): Promise<GamificationRewardResponse> {
	const response = await fetch(`${API_BASE_URL}/gamification/win`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ attempts }),
	});

	if (!response.ok) {
		throw new Error('Gamification reward request failed');
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