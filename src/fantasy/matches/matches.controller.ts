import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';
import { JwtUser } from 'src/xapp/auth/interfaces/jwt-user.interface';

@Controller('fantasy/matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  fetchMatches(
    @Query('status', new ParseIntPipe({ optional: true })) status: number,
    @Query('competition_id', new ParseIntPipe({ optional: true }))
    competitionId: number,
  ) {
    return this.matchesService.fetchMatches(status, competitionId);
  }

  @Get(':id/scorecard')
  fetchScoreCard(@Param('id', ParseIntPipe) matchId: number) {
    return this.matchesService.fetchScoreCard(matchId);
  }

  @Get(':id/commentary')
  fetchCommentary(@Param('id', ParseIntPipe) matchId: number) {
    return this.matchesService.fetchCommentary(matchId);
  }

  @Get(':id/score')
  fetchScore(@Param('id', ParseIntPipe) matchId: number) {
    return this.matchesService.fetchScore(matchId);
  }

  @Get(':id/players')
  fetchPlayers(@Param('id', ParseIntPipe) matchId: number) {
    return this.matchesService.fetchPlayers(matchId);
  }

  @Get(':id/contests')
  fetchContests(@Param('id', ParseIntPipe) matchId: number) {
    return this.matchesService.fetchContests(matchId);
  }

  @Get(':id/teams')
  fetchTeams(
    @CurrentUser() user: JwtUser,
    @Param('id', ParseIntPipe) matchId: number,
  ) {
    return this.matchesService.fetchTeams(user.userId, matchId);
  }
}
