import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChampionsService {
  constructor(private prisma: PrismaService) {} // Injection du service global

  // Exemple : Récupérer tous les noms pour une liste déroulante sur le front
  async getAllNames() {
    return this.prisma.champion.findMany({
      select: { name: true },
    });
  }
}