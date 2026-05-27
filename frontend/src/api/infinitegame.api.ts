import { API_BASE_URL } from "../config/api";
import type { ChampionRandom , GuessResponse } from "./type.api";

export async function getInfiniteChamp(): Promise<ChampionRandom> {
	const response = await fetch(`${API_BASE_URL}/infiniteMatches/random`);

	if (!response.ok) {
		throw new Error('Champion names request failed');
	}

	const data: ChampionRandom = await response.json();

	return data;
}

export async function sendInfiniteGuess(championName: string, targetId: string): Promise<GuessResponse> {
	const response = await fetch(`${API_BASE_URL}/infiniteMatches/guess`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ guessName: championName, targetId: targetId}),
	});
	if (!response.ok) {
		throw new Error('Failed to submit guess');
	}
	return response.json();
}