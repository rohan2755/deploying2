import { Controller, Get } from '@nestjs/common';
import { ScoresService } from './scores.service';

@Controller('fantasy/scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get('all')
  fetchLiveScores() {
    return this.scoresService.fetchLiveScores();
  }
}
