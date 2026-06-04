import { API_BASE_URL } from "../config/api";
import type { ChampionDay, GuessResponse } from "./type.api";


export async function getDailyChamp(): Promise<ChampionDay> {
    const response = await fetch(`${API_BASE_URL}/dailyMatches/champ`);

    if (!response.ok) {
        throw new Error('Champion names request failed');
    }

    const data: ChampionDay = await response.json();

    return data;
}

export async function sendGuess(championName: string): Promise<GuessResponse> {
	const response = await fetch(`${API_BASE_URL}/dailyMatches/guess`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: championName}),
	});
	if (!response.ok) {
		throw new Error('Failed to submit guess');
	}
	return response.json();
}