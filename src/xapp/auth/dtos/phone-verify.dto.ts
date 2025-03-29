import { IsPhoneNumber } from 'class-validator';

export class PhoneVerifyDto {
  @IsPhoneNumber('IN')
  phone: string;
}
