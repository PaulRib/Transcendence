import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChampionsService } from '../champions/champions.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

@Injectable()

export class InfinitematchesService {
  constructor(private prisma: PrismaService, private championsService: ChampionsService) {}

	private compareArrays(arr1: string[], arr2: string[]): 'correct' | 'partial' | 'incorrect' {
		const matches = arr1.filter(item => arr2.includes(item)).length;
		if (matches === 0) return 'incorrect';
		if (matches === arr1.length && arr1.length === arr2.length) return 'correct';
		return 'partial';
		}

  	private parseToArrays(value: string): string[] {
		if (!value) return [];
		return value.split(',').map(item => item.trim());
	}

	async getRandomChamp() {
		const totalChamps = await this.prisma.champion.count();
		if (totalChamps === 0) { throw new InternalServerErrorException('No champions found in the database'); }
		const randomIndex = Math.floor(Math.random() * totalChamps);
		const selectedChampion = await this.prisma.champion.findFirst({
			skip: randomIndex,
			take: 1,
			orderBy: { name: 'asc' },
		});
		if (!selectedChampion) {
      		throw new InternalServerErrorException('Failed to get random champion');
   	 	}
		return selectedChampion.id;
	}

	async verifyInfiniteGuess(guessName: string, targetId: string) {
    const todayChamp = await this.championsService.getExactChampById(targetId);
    const guessedChamp = await this.championsService.getExactChampByName(guessName);
    
    if (!todayChamp || !guessedChamp) {
      throw new NotFoundException("Can't find the champions for comparison");
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
      isWin: guessedChamp.id === todayChamp.id 
    };
  }
}