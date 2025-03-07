import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commentary } from 'src/common/entities/commentary.entity';
import { ContestParticipant } from 'src/common/entities/contest-participant.entity';
import { Contest } from 'src/common/entities/contest.entity';
import { Match } from 'src/common/entities/match.entity';
import { Player } from 'src/common/entities/player.entity';
import { Score } from 'src/common/entities/score.entity';
import { ScoreCard } from 'src/common/entities/scorecard.entity';
import { Team } from 'src/common/entities/team.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    @InjectRepository(Contest)
    private contestRepository: Repository<Contest>,
    @InjectRepository(ContestParticipant)
    private contestParticipantRepository: Repository<ContestParticipant>,
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

  fetchContests(matchId: number) {
    return this.contestRepository
      .createQueryBuilder('contest')
      .leftJoinAndSelect('contest.contestParticipants', 'participant')
      .select([
        'contest.id as id',
        'contest.match_id as match_id',
        'contest.spot as spot',
        'contest.entry_fees as entry_fees',
        'contest.prize_pool as prize_pool',
        'contest.winners as winners',
        'contest.entry_type as entry_type',
        'contest.team_size as team_size',
        'COUNT(participant.id) AS participantCount',
      ])
      .where('contest.match_id = :matchId', { matchId })
      .groupBy('contest.id')
      .getRawMany();
  }

  fetchMyContests(userId: number, matchId: number) {
    return this.contestParticipantRepository
      .createQueryBuilder('contestParticipant')
      .select('contest.id', 'id')
      .addSelect('contest.entry_fees', 'entry_fees')
      .addSelect('contest.prize_pool', 'prize_pool')
      .addSelect('contest.winners', 'winners')
      .addSelect('contest.entry_type', 'entry_type')
      .addSelect('contest.spot', 'spot')
      .addSelect(
        'JSON_AGG(DISTINCT team.name) FILTER (WHERE team.name IS NOT NULL)',
        'team_names',
      )
      .innerJoin('contestParticipant.contest', 'contest')
      .innerJoin('contest.match', 'match')
      .leftJoin('contestParticipant.team', 'team')
      .where('match.id = :matchId', { matchId })
      .andWhere('contestParticipant.user_id = :userId', { userId })
      .groupBy(
        'contest.id, contest.entry_fees, contest.prize_pool, contest.winners, contest.entry_type',
      )
      .getRawMany();
  }

  fetchMyMatches(userId: number, status: number) {
    const statusCondition =
      status === 2 ? 'match.status IN (:...status)' : 'match.status = :status';

    const statusValue = status === 2 ? [2, 4] : status;

    return this.userRepository
      .createQueryBuilder('user')
      .select('match.id', 'id')
      .addSelect('match.title', 'title')
      .addSelect('match.status', 'status')
      .addSelect('match.date_start_ist', 'date_start_ist')
      .addSelect('match.teama', 'teama')
      .addSelect('match.teamb', 'teamb')
      .addSelect('competition.title', 'competition_title')
      .addSelect('competition.match_format', 'competition_match_format')
      .addSelect('COUNT(DISTINCT team.id)', 'teamCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(DISTINCT cp.id)')
          .from(ContestParticipant, 'cp')
          .innerJoin('cp.contest', 'c')
          .where('cp.user_id = :userId', { userId })
          .andWhere('c.match_id = match.id');
      }, 'contestCount')
      .innerJoin('user.teams', 'team')
      .innerJoin('team.match', 'match')
      .innerJoin('match.competition', 'competition')
      .where('user.id = :userId', { userId })
      .andWhere(status !== undefined ? statusCondition : '1=1', {
        status: statusValue,
      })
      .groupBy('match.id, competition.title, competition.match_format')
      .getRawMany();
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
