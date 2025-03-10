import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest } from 'src/common/entities/contest.entity';
import { In, Repository } from 'typeorm';
import { JoinContestDto } from './dtos/join-contest.dto';
import { Team } from 'src/common/entities/team.entity';
import { ContestParticipant } from 'src/common/entities/contest-participant.entity';
import { TransactionsService } from 'src/xapp/transactions/transactions.service';

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

    await this.transactionsService.create(userId, {
      amount: contest.entry_fees,
      category: 'fantasy',
      description: 'Joinning Contest',
      type: 'debit',
      tType: 'joining',
    });

    await this.contestParticipantRepository.save(
      joinContestDto.team_ids.map((tid) => {
        return {
          contest: { id: contest.id },
          user: { id: userId },
          team: { id: tid },
        };
      }) as ContestParticipant[],
    );

    return {
      message: 'Join contest successfully',
    };
  }
}
