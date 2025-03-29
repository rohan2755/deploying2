import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest } from 'src/common/entities/contest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(Contest)
    private contestRepository: Repository<Contest>,
  ) {}

  fetchByMatchId(matchId: number) {
    return this.contestRepository.findBy({ match: { id: matchId } });
  }
}
