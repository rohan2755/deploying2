import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from './match.entity';

@Entity({ name: 'scorecards', schema: 'fantasy' })
export class ScoreCard {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Match, (match) => match.scoreCard)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column()
  iid: number;

  @Column('jsonb')
  inning: any;
}
