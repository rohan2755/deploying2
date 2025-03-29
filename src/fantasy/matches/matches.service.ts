import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commentary } from 'src/common/entities/commentary.entity';
import { Match } from 'src/common/entities/match.entity';
import { Player } from 'src/common/entities/player.entity';
import { Score } from 'src/common/entities/score.entity';
import { ScoreCard } from 'src/common/entities/scorecard.entity';
import { Team } from 'src/common/entities/team.entity';
import { In, Repository } from 'typeorm';

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

  fetchTeams(userId: number, matchId: number) {
    return this.teamRepository.find({
      select: {
        teamPlayers: {
          id: true,
          player: {
            title: true,
            logo_url: true,
          },
          leadership_role: true,
        },
      },
      where: {
        user: { id: userId },
        match: { id: matchId },
        teamPlayers: {
          leadership_role: In(['c', 'vc', 'pp']),
        },
      },
      relations: {
        teamPlayers: {
          player: true,
        },
      },
    });
  }
}
