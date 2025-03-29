import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/common/entities/team.entity';
import { Player } from 'src/common/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
