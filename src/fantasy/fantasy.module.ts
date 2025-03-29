import { Module } from '@nestjs/common';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { ContestsModule } from './contests/contests.module';
import { PrizeDistributionsModule } from './prize-distributions/prize-distributions.module';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [
    TeamsModule,
    MatchesModule,
    CompetitionsModule,
    ContestsModule,
    PrizeDistributionsModule,
    ScoresModule,
  ],
})
export class FantasyModule {}
