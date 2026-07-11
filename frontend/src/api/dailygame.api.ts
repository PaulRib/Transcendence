import { API_BASE_URL } from "../config/api";
import type { GuessResponse, DailyData } from "./type.api";

export async function sendGuess(championName: string): Promise<GuessResponse> {
	const response = await fetch(`${API_BASE_URL}/dailyMatches/guess`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ name: championName }),
	});
	if (!response.ok) {
		throw new Error('Failed to submit guess');
	}
	return response.json();
}

export async function getDailyData(): Promise<DailyData> {
	const response = await fetch(`${API_BASE_URL}/dailyMatches/data`);
	if (!response.ok) {
		throw new Error('Failed to fetch daily metadata');
	}
	return response.json();
}
