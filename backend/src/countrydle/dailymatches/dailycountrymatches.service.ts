import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CountriesService } from '../countries/countries.service';

@Injectable()

export class DailycountrymatchesService {
  constructor(private prisma: PrismaService, private countriesService: CountriesService) {}

  private seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
  }

  async selectDayCountry() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const existingMatch = await this.prisma.dailyCountryMatch.findUnique({
		where: { date: today },
		include: { country: true },
	});

	if (existingMatch) {
		return existingMatch.country;
	}

    const totalCountries = await this.prisma.country.count();
	if (totalCountries === 0) { throw new Error('No countries found in the database'); }

	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const yesterdayMatch = await this.prisma.dailyCountryMatch.findUnique({
		where: { date: yesterday },
	});

	const seed = today.getFullYear() * 10000 + (today.getMonth() + 1 ) * 100 + today.getDate();
	let randomIndex = Math.floor(this.seededRandom(seed) * totalCountries);
	let selectedCountry = await this.prisma.country.findFirst({
		skip: randomIndex,
		take: 1,
		orderBy: { name: 'asc' },
	});

	if (!selectedCountry) {
        throw new Error('Failed to retrieve a country with skip');
    }

	if (yesterdayMatch && selectedCountry && selectedCountry.id === yesterdayMatch.countryId) {
		randomIndex = (randomIndex + 1) % totalCountries;
		selectedCountry = await this.prisma.country.findFirst({
			skip: randomIndex,
			take: 1,
			orderBy: { name: 'asc' },
		});
	}

	if (!selectedCountry) {
        throw new Error('Failed to retrieve a replacement country');
    }

	const newDaily = await this.prisma.dailyCountryMatch.create({
		data: {
			date: today,
			countryId: selectedCountry.id,
		},
		include: { country: true },
	});
	
	return newDaily.country;
  }

  async verifyGuess(guessName: string) {
	const todayCountry = await this.selectDayCountry();
	const guessedCountry = await this.countriesService.getExactCountryByName(guessName);
	if (!guessedCountry) {
		throw new Error("Can't find the country");
	}

	return {
		name: guessedCountry.name,
		flagUrl: guessedCountry.flagUrl,
		continent: {
			value: guessedCountry.continent,
			status: guessedCountry.continent === todayCountry.continent ? 'correct' : 'incorrect'
		},
		region: {
			value: guessedCountry.region,
			status: guessedCountry.region === todayCountry.region ? 'correct' : 'incorrect'
		},
		language: {
			value: guessedCountry.language,
			status: guessedCountry.language === todayCountry.language ? 'correct' : 'incorrect'
		},
		population: {
			value: guessedCountry.population,
			status: guessedCountry.population === todayCountry.population
				? 'correct'
				: guessedCountry.population < todayCountry.population ? 'higher' : 'lower'
		},
		currency: {
			value: guessedCountry.currency,
			status: guessedCountry.currency === todayCountry.currency ? 'correct' : 'incorrect'
		},
		currencyName: {
			value: guessedCountry.currencyName,
			status: guessedCountry.currencyName === todayCountry.currencyName ? 'correct' : 'incorrect'
		},
		isWin: guessedCountry.name === todayCountry.name
	}
  }
}
