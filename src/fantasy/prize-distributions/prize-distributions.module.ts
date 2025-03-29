import { Module } from '@nestjs/common';
import { PrizeDistributionsController } from './prize-distributions.controller';
import { PrizeDistributionsService } from './prize-distributions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeDistribution } from 'src/common/entities/prize-distribution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrizeDistribution])],
  controllers: [PrizeDistributionsController],
  providers: [PrizeDistributionsService],
})
export class PrizeDistributionsModule {}
