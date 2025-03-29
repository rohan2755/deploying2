import { Controller, Get } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';

@Controller('fantasy/competitions')
export class CompetitionsController {
  constructor(private readonly competitionService: CompetitionsService) {}

  @Get()
  fetchAll() {
    return this.competitionService.fetchAll();
  }
}
