import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  fetchTransaction(@CurrentUser() user: JwtUser) {
    return this.transactionsService.fetchTransactions(user.userId);
  }
}
