import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from 'src/common/entities/score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
