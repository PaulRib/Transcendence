import { Controller, Get, Query } from '@nestjs/common';
import { ChampionsService } from './champions.service';

@Controller('champions')
export class ChampionsController {
  constructor(private readonly championsService: ChampionsService) {}



  @Get('names')
  async getAllNames() {
    return this.championsService.getAllNames();
  }

}