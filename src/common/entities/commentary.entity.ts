import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from './match.entity';

@Entity({ name: 'commentaries', schema: 'fantasy' })
export class Commentary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, (match) => match.players)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column()
  event_id: string;

  @Column()
  event: string;

  @Column()
  over: number;

  @Column()
  ball: number;

  @Column()
  score: number;

  @Column()
  commentary: string;
}
