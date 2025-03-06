/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  IsInt,
  IsEnum,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

enum LeaderShipRole {
  CAPTAIN = 'c',
  VICE_CAPTAIN = 'vc',
  POWER_PLAYER = 'pp',
}

class TPlayer {
  @IsInt()
  player_id: number;

  @IsDefined()
  @IsOptional()
  @IsEnum(LeaderShipRole)
  leadership_role: LeaderShipRole;
}

export class UpdateTeamDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TPlayer)
  players: TPlayer[];
}
