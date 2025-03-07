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

    const sortOrder = {
      promotional: 1,
      deposit: 2,
      trading: 3,
      winning: 4,
    };

    userWallets.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);

    const transactionWallets: Partial<TransactionWallet>[] = [];
    const newUserWallets: Partial<Wallet>[] = [];
    if (createTransactionDto.type == 'debit') {
      let remainingAmount = createTransactionDto.amount;

      for (const uw of userWallets) {
        if (remainingAmount <= 0) break;
        const amountToSubtractFromWallet = Math.min(
          uw.balance,
          remainingAmount,
        );
        transactionWallets.push({
          id: uw.id,
          wallet_type: uw.type,
          amount: amountToSubtractFromWallet,
        });
        newUserWallets.push({
          id: uw.id,
          user: uw.user,
          balance: uw.balance - amountToSubtractFromWallet,
          type: uw.type,
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

    await this.transactionRepository.save({
      ...createTransactionDto,
      user: { id: userId },
      date: new TZDate(),
      transactionWallets: transactionWallets,
    });

    await this.walletRepository.save(newUserWallets);
  }
}
