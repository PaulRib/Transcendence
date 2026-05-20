import { API_BASE_URL } from "../config/api";

export type ChampionDay =  {
    name: string;
};

export type GuessAttribute<T> = {
	value: T;
	status: 'correct' | 'partial' | 'incorrect' | 'higher' | 'lower';
};

export type GuessResponse = {
	name: string;
	gender: GuessAttribute<string>;
	resource_type: GuessAttribute<string>;
	positions: GuessAttribute<string>;
	species: GuessAttribute<string>;
	range_type: GuessAttribute<string>;
	region: GuessAttribute<string>;
	release_year: GuessAttribute<number>;
};

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