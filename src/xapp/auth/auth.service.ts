import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhoneVerifyDto } from './dtos/phone-verify.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OtpVerifyDto } from './dtos/otp-verify.dto';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/common/entities/user.entity';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private readonly walletService: WalletsService,
  ) {}

  async phoneVerify(phoneVerifyDto: PhoneVerifyDto) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const nUser = this.userRepository.create({
      ...phoneVerifyDto,
      otp: otp.toString(),
    });

    this.eventEmitter.emit('send-otp', phoneVerifyDto.phone, otp);

    await this.userRepository.upsert(nUser, ['phone']);
  }

  async otpVerify(otpVerifyDto: OtpVerifyDto) {
    const user = await this.userRepository.findOneBy({
      phone: otpVerifyDto.phone,
      otp: otpVerifyDto.otp,
    });

    if (user == null) {
      throw new UnauthorizedException('Invalid OTP');
    }

    user.otp = null;
    await this.userRepository.save(user);

    const wallets = await this.walletService.details(user.id);
    if (wallets.length == 0) {
      await this.walletService.create(user.id);
    }

    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @OnEvent('send-otp', { async: true })
  async sendOtp(phone: string, otp: string) {
    const url = this.configService.get<string>('SMS_API', '');
    const authKey = this.configService.get<string>('SMS_AUTH_KEY');
    const sidKey = this.configService.get<string>('SMS_SID_KEY');

    await firstValueFrom(
      this.httpService.get(url, {
        params: {
          authkey: authKey,
          country_code: '91',
          mobile: phone,
          sid: sidKey,
          var: otp,
        },
      }),
    );
  }
}
