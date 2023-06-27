import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from 'src/cache/cache.module';
import { GameController } from './game.controller';
import {MatchModule} from "../match/match.module";
import {MatchService} from "../match/match.service";

@Module({
  controllers: [GameController],
  imports: [CacheModule, UserModule,MatchModule],
  providers: [GameGateway, GameService],
  exports: [GameService],
})
export class GameModule {}
