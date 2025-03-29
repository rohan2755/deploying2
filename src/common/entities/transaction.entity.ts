import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TransactionWallet } from './transaction_wallet.entity';

@Entity({ name: 'transactions', schema: 'public' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ enum: ['credit', 'debit'] })
  type: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  category: string;

  @OneToMany(
    () => TransactionWallet,
    (transactionWallet) => transactionWallet.transaction,
    { cascade: true },
  )
  transactionWallets: TransactionWallet[];
}
