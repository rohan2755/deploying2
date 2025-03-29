import { Body, Controller, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dtos/create-team.dto';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';
import { JwtUser } from 'src/xapp/auth/interfaces/jwt-user.interface';

@Controller('fantasy/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto, user.userId);
  }
}
