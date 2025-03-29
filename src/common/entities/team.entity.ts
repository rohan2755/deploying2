import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Match } from './match.entity';
import { TeamPlayer } from './team-player.entity';
import { ContestParticipant } from './contest-participant.entity';

@Entity({ name: 'teams', schema: 'fantasy' })
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Match, (match) => match.teams)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column()
  total_points: number;

  @OneToMany(() => TeamPlayer, (teamPlayer) => teamPlayer.team, {
    cascade: true,
  })
  teamPlayers: TeamPlayer[];

  @Column()
  size: number;

  @OneToMany(
    () => ContestParticipant,
    (contestParticipant) => contestParticipant.team,
  )
  contestParticipants: ContestParticipant[];
}
