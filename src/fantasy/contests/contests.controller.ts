import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ContestsService } from './contests.service';

@Controller('fantasy/contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get()
  fetchByMatchId(@Query('match_id', ParseIntPipe) matchId: number) {
    return this.contestsService.fetchByMatchId(matchId);
  }
}
