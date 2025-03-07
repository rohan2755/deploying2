import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contest } from './contest.entity';
import { User } from './user.entity';
import { Team } from './team.entity';

@Entity({ name: 'contest_participants', schema: 'fantasy' })
export class ContestParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contest, (contest) => contest.contestParticipants)
  @JoinColumn({ name: 'contest_id' })
  contest: Contest;

  @ManyToOne(() => User, (user) => user.contestParticipants)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, (team) => team.contestParticipants)
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
