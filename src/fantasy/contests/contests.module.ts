import { Module } from '@nestjs/common';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from 'src/common/entities/contest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contest])],
  controllers: [ContestsController],
  providers: [ContestsService],
})
export class ContestsModule {}
