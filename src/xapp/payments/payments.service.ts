/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  RawBodyRequest,
} from '@nestjs/common';
import { Cashfree, CreateOrderRequest } from 'cashfree-pg';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/common/entities/payment.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class PaymentsService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly transactionService: TransactionsService,
  ) {}

  onModuleInit() {
    Cashfree.XClientId = this.configService.get<string>(
      'CASHFREE_PAYMENT_CLIENT_KEY',
    );
    Cashfree.XClientSecret = this.configService.get<string>(
      'CASHFREE_PAYMENT_SECRET_KEY',
    );

    const isSandBox = this.configService.get<string>('CASHFREE_IS_SANDBOX');

    if (isSandBox == 'true') {
      Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
    } else {
      Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
    }
  }

  async createOrder(userId: number, createOrderRequest: CreateOrderRequest) {
    const payload = await Cashfree.PGCreateOrder(
      '2023-08-01',
      createOrderRequest,
    );

    const orderId = payload.data.order_id;

    await this.paymentRepository.insert({
      user: { id: userId },
      amount: createOrderRequest.order_amount,
      status: 'pending',
      description: createOrderRequest.order_note,
      order_data: payload.data,
      order_id: orderId,
    });

    return payload.data;
  }

  async webhook(req: RawBodyRequest<Request>) {
    try {
      const payload = Cashfree.PGVerifyWebhookSignature(
        req.headers['x-webhook-signature']!.toString(),
        req.rawBody!.toString(),
        req.headers['x-webhook-timestamp']!.toString(),
      );

      const order = payload.object.data.order;
      const userId = payload.object.data.customer_details.customer_id;

      let status = 'pending';

      if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
        status = 'success';
      } else if (
        payload.type === 'PAYMENT_FAILED_WEBHOOK' ||
        payload.type === 'PAYMENT_USER_DROPPED_WEBHOOK'
      ) {
        status = 'failed';
      }

      await this.paymentRepository.update(
        { order_id: order.order_id },
        { status: status, webhook_response: payload.raw },
      );

      if (status === 'success') {
        await this.transactionService.create(userId, {
          amount: order.order_amount,
          category: 'xapp',
          description: 'Add money into wallet',
          type: 'credit',
          sub_category: 'recharge',
        });
      }
    } catch {
      throw new BadRequestException('Webhook verification failed');
    }
  }
}
