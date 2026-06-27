import { API_BASE_URL } from "@/config/api";

export type MatchResult = "win" | "draw" | "loose" | null;

export type MatchHistoryUser = {
	id: string;
	username: string;
	avatar_url: string | null;
};

export type MatchHistoryParticipant = {
	result: MatchResult;
	score: number;
	user: MatchHistoryUser;
};

export type MatchHistoryEntry = {
	id: string;
	result: MatchResult;
	score: number;
	match: {
		id: string;
		game_mode: string;
		played_at: string;
		participants: MatchHistoryParticipant[];
	};
};

export async function getMatchHistory (token: string): Promise<MatchHistoryEntry[]> {
	const response = await fetch(`${API_BASE_URL}/multiplayer/history`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Match history request failed");
	}

	return response.json();
}