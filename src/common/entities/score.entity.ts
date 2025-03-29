import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from './match.entity';

@Entity({ name: 'scores', schema: 'fantasy' })
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Match, (match) => match.score)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column('jsonb')
  teams: any;

  @Column()
  status_str: string;

  @Column()
  status_note: string;
}
