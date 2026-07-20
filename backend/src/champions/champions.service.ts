import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChampionsService {
  constructor(private prisma: PrismaService) {}

  async getAllNames() {
    return this.prisma.champion.findMany({
      select: { name: true },
    });
  }

  async getExactChampByName(name: string) {
	try {
		const champ =  this.prisma.champion.findUnique({
			where: {name},
		})
		return (champ);
	}
	catch {
		return null;
	}
  }

  async getExactChampById(id: string) {
	return this.prisma.champion.findUnique({
		where: {id},
	})
  }
}