import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class GameService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  ) {}

  async getPendingList() {
    return await this.cacheService.getAllPendingUser();
  }

  async addPendingList(socket: Socket, userId: number) {
    const user = await this.userService.getOne({ id: userId });
    await this.cacheService.addPandingUser(socket.id, user);
    // return;
    // if (!pending) {
    //   return this.cache.set('pending', { userId, socketId: socket.id });
    // }
    // await this.cache.del('pending');
    // const [opponent, owner] = await Promise.all([
    //   this.userService.getOne({ id: pending.userId }),
    //   this.userService.getOne({ id: userId }),
    // ]);
    // const scoreBoard: IScoreBoard = {
    //   [pending.socketId]: {
    //     user: opponent,
    //     score: 0,
    //   },
    //   [socket.id]: {
    //     user: owner,
    //     score: 0,
    //   },
    // };
    // await this.addScoreBoard(scoreBoard);
    // socket.emit('start', { socketId: pending.socketId, user: opponent });
    // socket
    //   .to(pending.socketId)
    //   .emit('start', { socketId: socket.id, user: owner });
    // console.log(await this.cache.get('scoreBoard'));
  }

  async removePendingList(socketId: string) {
    await this.cacheService.removePendingUser(socketId);
  }
}
