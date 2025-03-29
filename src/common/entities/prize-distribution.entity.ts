import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contest } from './contest.entity';

@Entity({ name: 'prize_distributions', schema: 'fantasy' })
export class PrizeDistribution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: number;

  @Column()
  end: number;

  @Column()
  prize: number;

  @ManyToOne(() => Contest, (contest) => contest.prizeDistributions)
  @JoinColumn({ name: 'contest_id' })
  contest: Contest;
}
