import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest } from 'src/common/entities/contest.entity';
import { In, Repository } from 'typeorm';
import { JoinContestDto } from './dtos/join-contest.dto';
import { Team } from 'src/common/entities/team.entity';
import { ContestParticipant } from 'src/common/entities/contest-participant.entity';
import { TransactionsService } from 'src/xapp/transactions/transactions.service';
import { LeaderBoard } from 'src/common/entities/leaderboard.entity';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(ContestParticipant)
    private contestParticipantRepository: Repository<ContestParticipant>,
    @InjectRepository(Contest)
    private contestRepository: Repository<Contest>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private readonly transactionsService: TransactionsService,
    @InjectRepository(LeaderBoard)
    private leaderboardRepository: Repository<LeaderBoard>,
  ) {}

  async join(userId: number, joinContestDto: JoinContestDto) {
    const contest = await this.contestRepository.findOne({
      where: {
        id: joinContestDto.contest_id,
      },
      relations: {
        match: true,
      },
    });

    if (contest == null) {
      throw new BadRequestException('Contest not found');
    }

    if (contest.match.status != 1) {
      throw new BadRequestException(
        'Only upcoming matches contest allow to join',
      );
    }

    const countOfParticipants = await this.contestParticipantRepository.countBy(
      {
        contest: { id: contest.id },
      },
    );

    if (countOfParticipants == contest.spot) {
      throw new BadRequestException('Contest are filled');
    }

    if (contest.entry_type == 'single') {
      if (joinContestDto.team_ids.length > 1) {
        throw new BadRequestException('Only per person single team allow');
      }
    }

    const teams = await this.teamRepository.findBy({
      id: In(joinContestDto.team_ids),
      match: contest.match,
      user: { id: userId },
    });

    if (teams.length == 0 && joinContestDto.team_ids.length == teams.length) {
      throw new BadRequestException('Invalid teams');
    }

    const contestParticipants = await this.contestParticipantRepository.findBy({
      contest: { id: contest.id },
      user: { id: userId },
      team: { id: In(joinContestDto.team_ids) },
    });

    if (contestParticipants.length > 0) {
      throw new BadRequestException('Contest already join');
    }

    const cc1 = teams.every((t) => t.size == contest.team_size);

    if (!cc1) {
      throw new BadRequestException('Invalid team sizes');
    }

    const transaction = await this.transactionsService.create(userId, {
      amount: contest.entry_fees,
      category: 'fantasy',
      description: contest.match.title,
      type: 'debit',
      sub_category: 'joining',
    });

    await this.contestParticipantRepository.save(
      joinContestDto.team_ids.map((tid) => {
        return {
          contest: { id: contest.id },
          user: { id: userId },
          team: { id: tid },
          debitTransaction: { id: transaction.id },
        };
      }) as ContestParticipant[],
    );

    return {
      message: 'Join contest successfully',
    };
  }

  async fetchLeaderboard(userId: number, contestId: number) {
    // Fetch all leaderboard data
    const leaderboard = await this.leaderboardRepository.find({
      select: {
        id: true,
        rank: true,
        prize: true,
        contestParticipant: {
          id: true,
          user: {
            username: true,
          },
          team: {
            name: true,
            total_points: true,
          },
        },
      },
      where: { contest_id: contestId },
      relations: {
        contestParticipant: {
          user: true,
          team: true,
        },
      },
    });

    // Find the user entry and move it to the top
    const userEntryIndex = leaderboard.findIndex(
      (entry) => entry.contestParticipant.user.id === userId,
    );

    if (userEntryIndex !== -1) {
      const userEntry = leaderboard.splice(userEntryIndex, 1)[0]; // Remove the user entry from the list
      leaderboard.unshift(userEntry); // Add the user entry at the start
    }

    return leaderboard;
  }
}
