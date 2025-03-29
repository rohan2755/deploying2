import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { Public } from 'src/common/decoraters/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Public()
  @Post('webhook')
  webhook(@Req() req: RawBodyRequest<Request>) {
    return this.paymentService.webhook(req);
  }
}
