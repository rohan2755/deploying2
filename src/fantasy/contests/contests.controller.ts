import { Body, Controller, Post } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { JoinContestDto } from './dtos/join-contest.dto';
import { JwtUser } from 'src/xapp/auth/interfaces/jwt-user.interface';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';

@Controller('fantasy/contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Post('/join')
  join(@CurrentUser() user: JwtUser, @Body() joinContestDto: JoinContestDto) {
    return this.contestsService.join(user.userId, joinContestDto);
  }
}
