import { API_BASE_URL } from "../config/api";

export type ChampionDay =  {
    name: string;
};

export async function getDailyChamp(): Promise<ChampionDay> {
    const response = await fetch(`${API_BASE_URL}/dailymatches/champ`);

    if (!response.ok) {
        throw new Error('Champion names request failed');
    }

    const data: ChampionDay = await response.json();

    return data;
}