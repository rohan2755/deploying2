import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competition } from 'src/common/entities/competition.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
  ) {}

  fetchAll() {
    return this.competitionRepository.find({});
  }
}
