import { IsInt } from 'class-validator';

export class AddMoneyDto {
  @IsInt()
  amount: number;
}