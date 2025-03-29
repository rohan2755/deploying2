import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity({ name: 'player_points', schema: 'fantasy' })
export class PlayerPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Player, (player) => player.playerPoint)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column()
  point: number;

  @Column()
  starting11: number;

  @Column()
  run: number;

  @Column()
  four: number;

  @Column()
  six: number;

  @Column()
  sr: number;

  @Column()
  fifty: number;

  @Column()
  duck: number;

  @Column()
  wkts: number;

  @Column()
  maidenover: number;

  @Column()
  er: number;

  @Column()
  catch: number;

  @Column()
  runoutstumping: number;

  @Column()
  runoutthrower: number;

  @Column()
  runoutcatcher: number;

  @Column()
  directrunout: number;

  @Column()
  stumping: number;

  @Column()
  thirty: number;

  @Column()
  bonus: number;

  @Column()
  bonuscatch: number;

  @Column()
  bonusbowedlbw: number;
}
