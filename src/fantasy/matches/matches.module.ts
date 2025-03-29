import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/common/entities/match.entity';
import { ScoreCard } from 'src/common/entities/scorecard.entity';
import { Score } from 'src/common/entities/score.entity';
import { Commentary } from 'src/common/entities/commentary.entity';
import { Player } from 'src/common/entities/player.entity';
import { Team } from 'src/common/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      ScoreCard,
      Score,
      Commentary,
      Player,
      Team,
    ]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
