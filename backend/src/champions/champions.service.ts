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

  //return all champ starting by the string name
  async getChampByName(name: string) {
    return this.prisma.champion.findMany({
      where: {
        name: {
          startsWith: name,
        },
      },
      select: { name: true },
    });
  }

  async getExactChampByName(name: string) {
	return this.prisma.champion.findUnique({
		where: {name},
	})
  }

  async getExactChampById(id: string) {
	return this.prisma.champion.findUnique({
		where: {id},
	})
  }
}