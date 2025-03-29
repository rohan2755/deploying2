/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { UpdateTeamDto } from './dtos/edit-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamPlayer)
    private teamPlayerRepository: Repository<TeamPlayer>,
  ) {}

  async createTeamValidate(createTeamDto: CreateTeamDto) {
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

    const players = await this.playerRepository.findBy({
      id: In(playerIds),
      match: { id: createTeamDto.match_id },
    });

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

  async updateTeamValidate(team: Team, updateTeamDto: UpdateTeamDto) {
    const userPlayers = updateTeamDto.players;

    if (team.size != userPlayers.length) {
      throw new BadRequestException('Invalid team size');
    }

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

    const players = await this.playerRepository.findBy({
      id: In(playerIds),
      match: team.match,
    });

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
      (v) => v >= 1 && v <= (team.size == 6 ? 3 : 8),
    );

    if (!cc2) {
      throw new BadRequestException('Invalid playing role data');
    }

    if (Object.keys(countOfTeams).length != 2) {
      throw new BadRequestException('Invalid teams data');
    }

    if (sumOfPoints > (team.size == 6 ? 60 : 100)) {
      throw new BadRequestException('Invalid points data');
    }
  }

  async create(createTeamDto: CreateTeamDto, userId: number) {
    await this.createTeamValidate(createTeamDto);

    const numberOfTeams = await this.teamRepository.countBy({
      user: { id: userId },
      match: { id: createTeamDto.match_id },
    });

    const name = `T${numberOfTeams == 0 ? 1 : numberOfTeams + 1}`;

    const team = this.teamRepository.create({
      user: { id: userId },
      name: name,
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

  async edit(teamId: number, updateTeamDto: UpdateTeamDto, userId: number) {
    const team = await this.teamRepository.findOne({
      where: {
        id: teamId,
        user: { id: userId },
      },
      relations: {
        match: true,
      },
    });

    if (team == null) {
      throw new BadRequestException('Team not found');
    }

    if (team.match.status != 1) {
      throw new BadRequestException('Match status is not upcoming');
    }

    await this.updateTeamValidate(team, updateTeamDto);

    await this.teamPlayerRepository.delete({ team: { id: teamId } });

    const updatedTeamPlayers = updateTeamDto.players.map((tp) => {
      return {
        team: { id: teamId },
        player: { id: tp.player_id },
        leadership_role: tp.leadership_role,
      };
    }) as TeamPlayer[];

    await this.teamPlayerRepository.save(updatedTeamPlayers);

    return {
      message: 'Team successfully updated',
    };
  }

  async teamDetail(teamId: number) {
    const twp = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: {
        teamPlayers: {
          player: {
            playerPoint: true,
          },
        },
      },
    });

    if (!twp) {
      return {};
    }

    return twp;

    // const roleWisePlayers = {
    //   wk: [],
    //   bat: [],
    //   bowl: [],
    //   all: [],
    // };

    // twp.teamPlayers.forEach((twpPlayer) => {
    //   const player = twpPlayer.player;
    //   const playingRole = player.playing_role;

    //   const playerData = {
    //     id: player.id,
    //     title: player.title,
    //     logo_url: player.logo_url,
    //     fantasy_player_rating: player.fantasy_player_rating,
    //     team_abbr: player.team_abbr,
    //     point: player.playerPoint ? player.playerPoint.point : null,
    //   };

    //   if (roleWisePlayers[playingRole]) {
    //     roleWisePlayers[playingRole].push({
    //       leadership_role: twpPlayer.leadership_role,
    //       players: playerData,
    //     });
    //   }
    // });

    // const data = {
    //   id: twp.id,
    //   name: twp.name,
    //   total_points: twp.total_points,
    //   teamPlayers: [
    //     { playing_role: 'wk', players: roleWisePlayers.wk },
    //     { playing_role: 'bat', players: roleWisePlayers.bat },
    //     { playing_role: 'bowl', players: roleWisePlayers.bowl },
    //     { playing_role: 'all', players: roleWisePlayers.all },
    //   ],
    // };

    // return data;
  }
}
