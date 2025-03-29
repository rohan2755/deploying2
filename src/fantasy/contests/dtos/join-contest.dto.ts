import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class JoinContestDto {
  @IsInt()
  contest_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  team_ids: number[];
}
