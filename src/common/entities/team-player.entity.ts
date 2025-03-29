import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { Player } from './player.entity';

@Entity({ name: 'team_players', schema: 'fantasy' })
export class TeamPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.teamPlayers)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Player, (player) => player.teamPlayers)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column()
  leadership_role: string;
}
