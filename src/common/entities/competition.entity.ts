import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from './match.entity';

@Entity({ name: 'competitions', schema: 'fantasy' })
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cid: number;

  @Column()
  title: string;

  @Column()
  abbr: string;

  @Column()
  status: string;

  @Column()
  datestart: Date;

  @Column()
  dateend: Date;

  @Column()
  total_matches: number;

  @Column()
  total_rounds: number;

  @Column()
  total_teams: number;

  @Column()
  match_format: string;

  @OneToMany(() => Match, (match) => match.competition)
  matches: Match[];
}
