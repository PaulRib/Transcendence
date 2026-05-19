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
}