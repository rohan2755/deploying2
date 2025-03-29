import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity({ name: 'transaction_wallets', schema: 'public' })
export class TransactionWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionWallets)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column()
  wallet_type: string;

  @Column()
  amount: number;
}
