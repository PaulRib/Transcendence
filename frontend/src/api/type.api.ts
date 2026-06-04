export type ChampionName =  {
    name: string;
};

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
	isWin: boolean;
};

export type ChampionRandom =  {
	id: string;
};