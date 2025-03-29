import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PhoneVerifyDto } from './dtos/phone-verify.dto';
import { OtpVerifyDto } from './dtos/otp-verify.dto';
import { Public } from 'src/common/decoraters/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('phone-verify')
  phoneVerify(@Body() phoneVerifyDto: PhoneVerifyDto) {
    return this.authService.phoneVerify(phoneVerifyDto);
  }

  @Post('otp-verify')
  otpVerify(@Body() OtpVerifyDto: OtpVerifyDto) {
    return this.authService.otpVerify(OtpVerifyDto);
  }
}
