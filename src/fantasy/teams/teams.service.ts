import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamPlayer } from 'src/common/entities/team-player.entity';
import { Team } from 'src/common/entities/team.entity';
import { In, Repository } from 'typeorm';
import { CreateTeamDto } from './dtos/create-team.dto';
import { Player } from 'src/common/entities/player.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async validateTeam(createTeamDto: CreateTeamDto) {
    const userPlayers = createTeamDto.players;

    const countOfLeaderShipRole = {
      c: 0,
      vc: 0,
      pp: 0,
    };
    for (const up of userPlayers) {
      if (`${up.leadership_role}` in countOfLeaderShipRole) {
        countOfLeaderShipRole[up.leadership_role]++;
      }
    }

    const cc1 = Object.values(countOfLeaderShipRole).every((v) => v == 1);

    if (!cc1) {
      throw new BadGatewayException('Invalid leadership role data');
    }

    const playerIds = userPlayers.map((player) => player.player_id);

    const players = await this.playerRepository.findBy({ id: In(playerIds) });

    if (userPlayers.length != players.length) {
      throw new BadRequestException('Invalid players');
    }

    const countOfPlayingRole = {
      wk: 0,
      bat: 0,
      bowl: 0,
      all: 0,
    };
    const countOfTeams: object = {};
    let sumOfPoints = 0;

    for (const player of players) {
      if (`${player.playing_role}` in countOfPlayingRole) {
        countOfPlayingRole[player.playing_role]++;
      }

      if (`${player.team_abbr}` in countOfTeams) {
        countOfTeams[player.team_abbr]++;
      } else {
        countOfTeams[player.team_abbr] = 1;
      }

      sumOfPoints += player.fantasy_player_rating;
    }

    const cc2 = Object.values(countOfPlayingRole).every(
      (v) => v >= 1 && v <= (createTeamDto.size == 6 ? 3 : 8),
    );

    if (!cc2) {
      throw new BadRequestException('Invalid playing role data');
    }

    if (Object.keys(countOfTeams).length != 2) {
      throw new BadRequestException('Invalid teams data');
    }

    if (sumOfPoints > (createTeamDto.size == 6 ? 60 : 100)) {
      throw new BadRequestException('Invalid points data');
    }
  }

  async create(createTeamDto: CreateTeamDto, userId: number) {
    await this.validateTeam(createTeamDto);

    const team = this.teamRepository.create({
      user: { id: userId },
      match: { id: createTeamDto.match_id },
      teamPlayers: createTeamDto.players.map((tp) => {
        return {
          player: { id: tp.player_id },
          leadership_role: tp.leadership_role,
        };
      }) as TeamPlayer[],
      size: createTeamDto.size,
    });

    await this.teamRepository.save(team);

    return {
      message: 'Team successfully created',
    };
  }
}
