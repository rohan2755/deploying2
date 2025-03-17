import { Module } from '@nestjs/common';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from 'src/common/entities/contest.entity';
import { Team } from 'src/common/entities/team.entity';
import { ContestParticipant } from 'src/common/entities/contest-participant.entity';
import { TransactionsModule } from 'src/xapp/transactions/transactions.module';
import { LeaderBoard } from 'src/common/entities/leaderboard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contest, ContestParticipant, Team, LeaderBoard]),
    TransactionsModule,
  ],
  controllers: [ContestsController],
  providers: [ContestsService],
})
export class ContestsModule {}
