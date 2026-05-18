import { API_BASE_URL } from "../config/api";

export type ChampionName =  {
    name: string;
};

export async function getChampionNames(): Promise<ChampionName[]> {
    const response = await fetch(`${API_BASE_URL}/champions/names`);

    if (!response.ok) {
        throw new Error('Champion names request failed');
    }

    const data: ChampionName[] = await response.json();

    return data;
}