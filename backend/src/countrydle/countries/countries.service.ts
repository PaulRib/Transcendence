import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CountriesService {
	constructor(private prisma: PrismaService) {}

	async getAllNames() {
		return this.prisma.country.findMany({
			select: { name: true, flagUrl: true },
			orderBy: { name: 'asc' },
		});
	}

	async getExactCountryByName(name: string) {
		return this.prisma.country.findUnique({
			where: { name },
		});
	}
	
	async getExactCountryById(id: string) {
		return this.prisma.country.findUnique({
			where: { id },
		});
	}
}
