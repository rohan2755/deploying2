import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contest } from './contest.entity';
import { User } from './user.entity';
import { Team } from './team.entity';
import { Transaction } from './transaction.entity';
import { LeaderBoard } from './leaderboard.entity';

@Entity({ name: 'contest_participants', schema: 'fantasy' })
export class ContestParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contest, (contest) => contest.contestParticipants)
  @JoinColumn({ name: 'contest_id' })
  contest: Contest;

  @ManyToOne(() => User, (user) => user.contestParticipants)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, (team) => team.contestParticipants)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToOne(
    () => Transaction,
    (transaction) => transaction.debitContestParticipant,
  )
  @JoinColumn({ name: 'debit_transaction_id' })
  debitTransaction: Transaction;

  @OneToOne(
    () => Transaction,
    (transaction) => transaction.creditContestParticipant,
  )
  @JoinColumn({ name: 'credit_transaction_id' })
  creditTransaction: Transaction;

  @OneToOne(() => LeaderBoard, (leaderBoard) => leaderBoard.contestParticipant)
  leaderBoard: LeaderBoard;
}
