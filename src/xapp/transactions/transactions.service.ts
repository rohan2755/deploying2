import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/common/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionWallet } from 'src/common/entities/transaction_wallet.entity';
import { Wallet } from 'src/common/entities/wallet.entity';
import { TZDate } from '@date-fns/tz';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const userWallets = await this.walletRepository.findBy({
      user: { id: userId },
    });

    const transactionWallets: Partial<TransactionWallet>[] = [];
    if (createTransactionDto.type == 'debit') {
      let remainingAmount = createTransactionDto.amount;

      for (const uw of userWallets) {
        if (remainingAmount <= 0) break;
        const amountToSubtractFromWallet = Math.min(
          uw.balance,
          remainingAmount,
        );
        uw.balance -= amountToSubtractFromWallet;
        transactionWallets.push({
          wallet_type: uw.type,
          amount: uw.balance,
        });
        remainingAmount -= amountToSubtractFromWallet;
      }

      if (remainingAmount > 0) {
        throw new Error('Insufficient Balance');
      }
    } else {
      if (createTransactionDto.tType == 'recharge') {
        const gstAmount = (createTransactionDto.amount % 28) / 100;
        transactionWallets.push(
          {
            wallet_type: 'deposit',
            amount: createTransactionDto.amount - gstAmount,
          },
          {
            wallet_type: 'promotional',
            amount: gstAmount,
          },
        );
      }
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user: { id: userId },
      date: new TZDate(),
      transactionWallets: transactionWallets,
    });

    await this.transactionRepository.save(transaction);
  }
}
