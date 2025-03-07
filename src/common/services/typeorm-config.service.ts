import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Competition } from '../entities/competition.entity';
import { Player } from '../entities/player.entity';
import { PlayerPoint } from '../entities/player-point.entity';
import { ScoreCard } from '../entities/scorecard.entity';
import { Score } from '../entities/score.entity';
import { Commentary } from '../entities/commentary.entity';
import { Team } from '../entities/team.entity';
import { TeamPlayer } from '../entities/team-player.entity';
import { Match } from '../entities/match.entity';
import { Payment } from '../entities/payment.entity';
import { Wallet } from '../entities/wallet.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionWallet } from '../entities/transaction_wallet.entity';
import { Contest } from '../entities/contest.entity';
import { PrizeDistribution } from '../entities/prize-distribution.entity';
import { ContestParticipant } from '../entities/contest-participant.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<undefined>('DB_TYPE'),
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [
        Competition,
        Match,
        Player,
        PlayerPoint,
        ScoreCard,
        Score,
        Commentary,
        Team,
        TeamPlayer,
        User,
        Payment,
        Wallet,
        Transaction,
        TransactionWallet,
        Contest,
        PrizeDistribution,
        ContestParticipant,
      ],
    };
  }
}
