import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { PrizeDistributionsService } from './prize-distributions.service';

@Controller('fantasy/prize-distributions')
export class PrizeDistributionsController {
  constructor(
    private readonly prizeDistributionsService: PrizeDistributionsService,
  ) {}

  @Get()
  fetchByContestId(@Query('contest_id', ParseIntPipe) contestId: number) {
    return this.prizeDistributionsService.fetchByContestId(contestId);
  }
}
