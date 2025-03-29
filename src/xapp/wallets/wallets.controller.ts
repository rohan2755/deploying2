import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';
import { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { AddMoneyDto } from './dtos/add-money.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Post('add-money')
  addMoney(@CurrentUser() user: JwtUser, @Body() addMoneyDto: AddMoneyDto) {
    return this.walletService.addMoney(user.userId, addMoneyDto);
  }

  @Get('details')
  details(@CurrentUser() user: JwtUser) {
    return this.walletService.details(user.userId);
  }
}
