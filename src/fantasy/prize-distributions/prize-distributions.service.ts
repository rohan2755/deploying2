import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrizeDistribution } from 'src/common/entities/prize-distribution.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrizeDistributionsService {
  constructor(
    @InjectRepository(PrizeDistribution)
    private prizeDistributionRepository: Repository<PrizeDistribution>,
  ) {}

  fetchByContestId(contestId: number) {
    return this.prizeDistributionRepository.findBy({
      contest: { id: contestId },
    });
  }
}
