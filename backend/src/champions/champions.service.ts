import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChampionsService {
  constructor(private prisma: PrismaService) {}

  //Change function to return name starting by a letter
  async getAllNames() {
    return this.prisma.champion.findMany({
      select: { name: true },
    });
  }

  //verifier si je peux remplacer startswith par un truc du style "nameis"
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

  async getChampByLetter(letter: string) {
    return this.prisma.champion.findMany({
      where: {
        name: {
          startsWith: letter,
        },
      },
      select: { name: true },
    });
  }

}