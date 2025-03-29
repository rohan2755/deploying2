import { IsPhoneNumber, Length } from 'class-validator';

export class OtpVerifyDto {
  @IsPhoneNumber('IN')
  phone: string;

  @Length(6, 6)
  otp: string;
}
