import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import "dotenv/config"; 

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
	const filePath = path.join(__dirname, 'data', 'champions.json');
	if (!fs.existsSync(filePath)) {
    	throw new Error(`Fichier introuvable : ${filePath}`);
  	}
	const rawData = fs.readFileSync(filePath, 'utf-8');
	const champions = JSON.parse(rawData);

	for (const champion of champions) {
		await prisma.champion.upsert({
			where: { name: champion.name },
				update: {}, // If the champion already exists, leave it unchanged
			create: {
				name: champion.name,
				gender: champion.gender,
				position: champion.positions.join(', '),
				species: champion.species.join(', '),
				resource_type: champion.resource_type,
				range_type: champion.range_type.join(', '),
				region: champion.regions.join(', '),
				release_year: new Date(champion.release_date).getFullYear(),
			},
		});
	}
	const countriesFilePath = path.join(__dirname, 'data', 'countries.json');
	if (!fs.existsSync(countriesFilePath)) {
		throw new Error(`Fichier introuvable : ${countriesFilePath}`);
	}
	const rawCountriesData = fs.readFileSync(countriesFilePath, 'utf-8');
	const countries = JSON.parse(rawCountriesData);

	for (const [index, country] of countries.entries()) {
		if (!country.continent?.en) {
			throw new Error(`Missing continent for ${country.country.en}`);
		}
		const continent = country.continent.en;
		const countryData = {
			name: country.country.en,
			continent: continent,
			flagUrl: country.flag.png.trim(),
			countryId: index + 1,
			language: country.language.en,
			region: continent,
			population: country.population,
			currency: country.currency.code,
			currencyName: country.currency.name.en,
		};

		await prisma.country.upsert({
			where: { name: countryData.name },
			update: {}, // If the country already exists, leave it unchanged
			create: countryData,
		});
	}
}

main()
	.catch((e) => {
		console.error('❌ Erreur lors du seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
