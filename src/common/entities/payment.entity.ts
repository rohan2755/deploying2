import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderEntity } from 'cashfree-pg';

@Entity({ name: 'payments', schema: 'public' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column()
  description: string;

  @Column('json')
  order_data: OrderEntity;

  @Column('json')
  webhook_response: string;

  @Column()
  order_id: string;
}
