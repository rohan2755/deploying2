/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  IsInt,
  IsEnum,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
  IsDefined,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsIn,
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

@ValidatorConstraint({ async: false })
class IsPlayersArraySizeValid implements ValidatorConstraintInterface {
  validate(players: TPlayer[], args: ValidationArguments) {
    const { object } = args;

    // Assuming 'size' is just a number now
    const teamSize: number = (object as CreateTeamDto).size;

    if (teamSize === 6) {
      return players.length === 6;
    } else if (teamSize === 11) {
      return players.length === 11;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const { object } = args;
    const teamSize: number = (object as CreateTeamDto).size;

    if (teamSize === 6) {
      return 'Team size must be exactly 6 players';
    } else if (teamSize === 11) {
      return 'Team size must be exactly 11 players';
    }

    return 'Invalid team size';
  }
}

export class CreateTeamDto {
  @ArrayNotEmpty()
  @Validate(IsPlayersArraySizeValid)
  @ValidateNested({ each: true })
  @Type(() => TPlayer)
  players: TPlayer[];

  @IsInt()
  match_id: number;

  @IsInt()
  @IsIn([6, 11])
  size: number;
}
