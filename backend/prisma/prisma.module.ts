import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Rends le module disponible partout automatiquement
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Permet d'exporter l'outil pour les autres services
})
export class PrismaModule {}