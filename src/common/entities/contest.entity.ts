import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { PrizeDistribution } from './prize-distribution.entity';
import { ContestParticipant } from './contest-participant.entity';
import { LeaderBoard } from './leaderboard.entity';

@Entity({ name: 'contests', schema: 'fantasy' })
export class Contest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  spot: number;

  @Column()
  entry_fees: number;

  @Column()
  prize_pool: number;

  @Column()
  winners: number;

  @Column()
  entry_type: string;

  @Column()
  team_size: number;

  @ManyToOne(() => Match, (match) => match.contests)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @OneToMany(
    () => PrizeDistribution,
    (prizeDistribution) => prizeDistribution.contest,
    {
      cascade: true,
    },
  )
  prizeDistributions: PrizeDistribution[];

  @OneToMany(
    () => ContestParticipant,
    (contestParticipant) => contestParticipant.contest,
  )
  contestParticipants: ContestParticipant[];

  @OneToMany(() => LeaderBoard, (leaderBoard) => leaderBoard.contest)
  leaderboards: LeaderBoard[];
}
