import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from 'src/cache/cache.module';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  imports: [CacheModule, UserModule],
  providers: [GameGateway, GameService],
  exports: [GameService],
})
export class GameModule {}
