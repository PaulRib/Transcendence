import { API_BASE_URL } from "../../config/api";
import type { CountryName } from "../type.api";

export async function getCountryNames(): Promise<CountryName[]> {
	const response = await fetch(`${API_BASE_URL}/countries/names`);

	if (!response.ok) {
		throw new Error('Country names request failed');
	}

	const data: CountryName[] = await response.json();

	return data;
}