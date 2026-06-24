import { API_BASE_URL } from "../../config/api";
import type { CountryDay, CountryGuessResponse } from "../type.api";

export async function getDailyCountry(): Promise<CountryDay> {
	const response = await fetch(`${API_BASE_URL}/dailyCountryMatches/country`);

	if (!response.ok) {
		throw new Error('Country request failed');
	}

	const data: CountryDay = await response.json();

	return data;
}

export async function sendCountryGuess(countryName: string): Promise<CountryGuessResponse> {
	const response = await fetch(`${API_BASE_URL}/dailyCountryMatches/guess`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: countryName }),
	});

	if (!response.ok) {
		throw new Error('Failed to submit country guess');
	}

	return response.json();
}