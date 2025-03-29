import { Module } from '@nestjs/common';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from 'src/common/entities/competition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competition])],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {}
