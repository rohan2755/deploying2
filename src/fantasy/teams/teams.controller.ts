import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dtos/create-team.dto';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';
import { JwtUser } from 'src/xapp/auth/interfaces/jwt-user.interface';
import { UpdateTeamDto } from './dtos/edit-team.dto';

@Controller('fantasy/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto, user.userId);
  }

  @Get(':id')
  fetchScore(@Param('id', ParseIntPipe) teamId: number) {
    return this.teamsService.teamDetail(teamId);
  }

  @Put(':id')
  edit(
    @Param('id', ParseIntPipe) teamId: number,
    @CurrentUser() user: JwtUser,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.edit(teamId, updateTeamDto, user.userId);
  }
}
