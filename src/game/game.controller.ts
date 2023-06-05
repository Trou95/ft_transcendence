import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { UseAuth } from 'src/@decorators/auth.decorator';
import { User } from 'src/@decorators/user.decorator';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';
import { IPendingUser } from 'src/interfaces/pending-user.interface';

@UseAuth()
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAllPendingUsers(@User() user: IJwtPayload) {
    const list = await this.gameService.getPendingList();
    return list.filter((x) => x.user.id !== user.id);
  }
}
