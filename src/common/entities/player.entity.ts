import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { PlayerPoint } from './player-point.entity';
import { TeamPlayer } from './team-player.entity';

@Entity({ name: 'players', schema: 'fantasy' })
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pid: number;

  @Column()
  title: string;

  @Column()
  birthdate: string;

  @Column()
  logo_url: string;

  @Column()
  batting_style: string;

  @Column()
  bowling_style: string;

  @Column()
  nationality: string;

  @Column()
  playing_role: string;

  @Column()
  fantasy_player_rating: number;

  @Column()
  fantasy_total_points: number;

  @Column()
  last_match_played: boolean;

  @Column()
  playing11: boolean;

  @Column()
  substitute: boolean;

  @Column()
  team_abbr: string;

  @Column()
  profile_image: string;

  @ManyToOne(() => Match, (match) => match.players)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @OneToOne(() => PlayerPoint, (playerPoint) => playerPoint.player)
  playerPoint: PlayerPoint;

  @OneToMany(() => TeamPlayer, (teamPlayer) => teamPlayer.player)
  teamPlayers: TeamPlayer[];
}
