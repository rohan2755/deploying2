import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Competition } from './competition.entity';
import { Player } from './player.entity';
import { Commentary } from './commentary.entity';
import { ScoreCard } from './scorecard.entity';
import { Score } from './score.entity';
import { Team } from './team.entity';
import { Contest } from './contest.entity';

@Entity({ name: 'matches', schema: 'fantasy' })
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mid' })
  match_id: number;

  @Column()
  title: string;

  @Column()
  short_title: string;

  @Column()
  status: number;

  @ManyToOne(() => Competition, (competition) => competition.matches)
  @JoinColumn({ name: 'competition_id' })
  competition: Competition;

  @Column('timestamp')
  date_start_ist: Date;

  @Column('jsonb')
  venue: any;

  @Column('jsonb')
  weather: any;

  @Column('jsonb')
  pitch: any;

  @Column()
  lineup: boolean;

  @Column('jsonb')
  teama: XTeam;

  @Column('jsonb')
  teamb: XTeam;

  @OneToMany(() => Player, (player) => player.match)
  players: Player[];

  @OneToMany(() => Commentary, (commentary) => commentary.match)
  commentaries: Commentary[];

  @OneToOne(() => ScoreCard, (scoreCard) => scoreCard.match)
  scoreCard: ScoreCard;

  @OneToOne(() => Score, (score) => score.match)
  score: Score;

  @OneToMany(() => Team, (team) => team.match)
  teams: Team[];

  @OneToMany(() => Contest, (contest) => contest.match)
  contests: Contest[];
}

interface XTeam {
  name: string;
  short_name: string;
  logo_url: string;
}
