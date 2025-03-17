/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateIf((o) => o.username !== '')
  @IsAlphanumeric()
  username: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio: string;
}
