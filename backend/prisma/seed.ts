import { PrismaClient } from '@prisma/client';
import * as fs from 'fs'; // -> pour lire les fichiers JSON
import * as path from 'path'; // -> pour gérer les chemins de fichiers
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
			where: { name: champion.name }, // On utilise l'index UNIQUE défini dans le schéma
      		update: {}, // Si le champion existe déjà, on ne touche à rien
			create: {
				name: champion.name,
				gender: champion.gender,
				position: champion.positions.join(', '), // Convertit le tableau en string pour le stockage
				species: champion.species.join(', '),
				resource_type: champion.resource_type,
				range_type: champion.range_type.join(', '),
				region: champion.regions.join(', '),
				release_year: new Date(champion.release_date).getFullYear(),
			},
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