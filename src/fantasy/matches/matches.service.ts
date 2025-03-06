/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commentary } from 'src/common/entities/commentary.entity';
import { Match } from 'src/common/entities/match.entity';
import { Player } from 'src/common/entities/player.entity';
import { Score } from 'src/common/entities/score.entity';
import { ScoreCard } from 'src/common/entities/scorecard.entity';
import { Team } from 'src/common/entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(ScoreCard)
    private scoreCardRepository: Repository<ScoreCard>,
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    @InjectRepository(Commentary)
    private commentaryRepository: Repository<Commentary>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  fetchMatches(status: number, competitionId: number) {
    return this.matchRepository.findBy({
      status: status,
      competition: { id: competitionId },
    });
  }

  fetchScoreCard(matchId: number) {
    return this.scoreCardRepository.findBy({ match: { id: matchId } });
  }

  fetchCommentary(matchId: number) {
    return this.commentaryRepository.findBy({ match: { id: matchId } });
  }

  fetchScore(matchId: number) {
    return this.scoreRepository.findBy({
      match: { id: matchId },
    });
  }

  fetchPlayers(matchId: number) {
    return this.playerRepository.findBy({ match: { id: matchId } });
  }

  async fetchTeams(userId: number, matchId: number) {
    const teamsWithPlayers = await this.teamRepository.find({
      where: {
        user: { id: userId },
        match: { id: matchId },
      },
      relations: {
        teamPlayers: {
          player: true,
        },
      },
    });

    const data: object[] = [];

    for (const twp of teamsWithPlayers) {
      const teamPoints = twp.total_points;

      const roleCount: { [key: string]: number } = {};
      const teamCount: { [key: string]: number } = {};
      const leaders: {
        name: string;
        logo_url: string;
        leadership_role: string;
      }[] = [];

      for (const obj of twp.teamPlayers) {
        roleCount[obj.player.playing_role] =
          (roleCount[obj.player.playing_role] || 0) + 1;

        teamCount[obj.player.team_abbr] =
          (teamCount[obj.player.team_abbr] || 0) + 1;

        if (['c', 'vc', 'pp'].includes(obj.leadership_role)) {
          leaders.push({
            name: obj.player.title,
            logo_url: obj.player.logo_url,
            leadership_role: obj.leadership_role,
          });
        }
      }

      data.push({
        id: twp.id,
        name: twp.name,
        total_points: teamPoints,
        roles_count: roleCount,
        size: twp.size,
        leaders: leaders,
        teams_count: teamCount,
      });
    }

    return data;
  }
}
