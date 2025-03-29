import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { PaymentsModule } from '../payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Wallet } from 'src/common/entities/wallet.entity';

@Module({
  imports: [PaymentsModule, TypeOrmModule.forFeature([User, Wallet])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
