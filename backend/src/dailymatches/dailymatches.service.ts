import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChampionsService } from '../champions/champions.service';

@Injectable()

export class DailymatchesService {
  constructor(private prisma: PrismaService, private championsService: ChampionsService) {}


  private seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
  }

  async selectDayChamp() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const existingMatch = await this.prisma.dailyMatch.findUnique({
		where: { date: today },
		include: { champion: true },
	});

	if (existingMatch) {
		return existingMatch.champion;
	}

    const totalChamps = await this.prisma.champion.count();
	if (totalChamps === 0) { throw new Error('No champions found in the database'); }
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const yesterdayMatch = await this.prisma.dailyMatch.findUnique({
		where: { date: yesterday },
	});

	//seed based on date
	const seed = today.getFullYear() * 10000 + (today.getMonth() + 1 ) * 100 + today.getDate();
	let randomIndex = Math.floor(this.seededRandom(seed) * totalChamps);
	let selectedChampion = await this.prisma.champion.findFirst({
		skip: randomIndex,
		take: 1,
		orderBy: { id: 'asc' },
	});

	if (!selectedChampion) {
        throw new Error('Failed to retrieve a champion with skip');
    }

	if (yesterdayMatch && selectedChampion && selectedChampion.id === yesterdayMatch.championId) {
		randomIndex = (randomIndex + 1) % totalChamps;
		selectedChampion = await this.prisma.champion.findFirst({
			skip: randomIndex,
			take: 1,
			orderBy: { id: 'asc' },
		});
	}

	if (!selectedChampion) {
        throw new Error('Failed to retrieve a replacement champion');
    }

	const newDaily = await this.prisma.dailyMatch.create({
		data: {
			date: today,
			championId: selectedChampion.id,
		},
		include: { champion: true },
	});
	
	return newDaily.champion;
	}

	private compareArrays(arr1: string[], arr2: string[]): 'correct' | 'partial' | 'incorrect' {
		const matches = arr1.filter(item => arr2.includes(item)).length;

		if (matches === 0) return 'incorrect';
		if (matches === arr1.length && arr1.length === arr2.length) return 'correct';
		return 'partial';
	}

	private parseToArrays(Value: string): string[] {
		if (!Value) return [];
		return Value.split(',').map(item => item.trim());
	}

	async verifyGuess(guessName: string) {
		const todayChamp = await this.selectDayChamp();
		const guessedChamp = await this.championsService.getExactChampByName(guessName);
		if (!guessedChamp) {
			throw new Error("Can't find the champion");
		}

		const guessedPos = this.parseToArrays(guessedChamp.position);
		const todayPos = this.parseToArrays(todayChamp.position);
		
		const guessedSpecies = this.parseToArrays(guessedChamp.species);
		const todaySpecies = this.parseToArrays(todayChamp.species);

		const guessedRange = this.parseToArrays(guessedChamp.range_type);
		const todayRange = this.parseToArrays(todayChamp.range_type);

		const guessedRegions = this.parseToArrays(guessedChamp.region);
		const todayRegions = this.parseToArrays(todayChamp.region);

		return {
			name: guessedChamp.name,
			gender: {
				value: guessedChamp.gender,
				status: guessedChamp.gender === todayChamp.gender ? 'correct' : 'incorrect'
			},
			resource_type: {
				value: guessedChamp.resource_type,
				status: guessedChamp.resource_type === todayChamp.resource_type ? 'correct' : 'incorrect'
			},
			positions: {
				value: guessedChamp.position,
				status: this.compareArrays(guessedPos, todayPos)
			},
			species: {
				value: guessedChamp.species,
				status: this.compareArrays(guessedSpecies, todaySpecies)
			},
			range_type: {
				value: guessedChamp.range_type,
				status: this.compareArrays(guessedRange, todayRange)
			},
			region: {
				value: guessedChamp.region,
				status: this.compareArrays(guessedRegions, todayRegions)
			},
			release_year: {
				value: guessedChamp.release_year,
				status: guessedChamp.release_year === todayChamp.release_year ? 'correct' : 
				guessedChamp.release_year < todayChamp.release_year ? 'higher' : 'lower'
			},
			isWin: guessedChamp.name === todayChamp.name
		}
	}
}