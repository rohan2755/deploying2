import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContestParticipant } from './contest-participant.entity';
import { Contest } from './contest.entity';

@Entity({ name: 'leaderboards', schema: 'fantasy' })
export class LeaderBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contest, (contest) => contest.leaderboards)
  @JoinColumn({ name: 'contest_id' })
  contest: Contest;

  @Column()
  contest_id: number;

  @Column()
  rank: number;

  @Column()
  prize: number;

  @OneToOne(
    () => ContestParticipant,
    (contestParticipant) => contestParticipant.leaderBoard,
  )
  @JoinColumn({ name: 'contest_participant_id' })
  contestParticipant: ContestParticipant;
}
