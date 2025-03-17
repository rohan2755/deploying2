import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';
import { AddMoneyDto } from './dtos/add-money.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { Wallet } from 'src/common/entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private readonly paymentService: PaymentsService,
  ) {}

  async addMoney(userId: number, addMoneyDto: AddMoneyDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user == null) {
      throw new BadRequestException('User not found');
    }

    return this.paymentService.createOrder(userId, {
      order_amount: addMoneyDto.amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: userId.toString(),
        customer_phone: user.phone,
      },
      order_note: 'Add money into wallet',
      order_tags: {
        sub_category: 'recharge',
      },
    });
  }

  async details(userId: number) {
    return await this.walletRepository.findBy({
      user: { id: userId },
    });
  }

  create(userId: number) {
    const wallets = this.walletRepository.create([
      {
        user: { id: userId },
        type: 'promotional',
        balance: 1525.43,
      },
      {
        user: { id: userId },
        type: 'deposit',
        balance: 8474.57,
      },
      {
        user: { id: userId },
        type: 'trading',
        balance: 0,
      },
      {
        user: { id: userId },
        type: 'winning',
        balance: 0,
      },
    ]);

    return this.walletRepository.save(wallets);
  }
}
