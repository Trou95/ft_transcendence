import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { CacheService } from 'src/cache/cache.service';
import { IPendingUser } from 'src/interfaces/pending-user.interface';
import { User } from 'src/user/user.entity';

export interface GameRoom {
  user: User;
  score: number;
  rivalRoomId: string;
}

@Injectable()
export class GameService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  ) {}

  public server: Server;

  async startGame(owner: GameRoom, rival: GameRoom) {
    this.server.to(owner.rivalRoomId).emit('start', owner.user);
    this.server.to(rival.rivalRoomId).emit('start', rival.user);
  }

  async finishGame(roomId: string) {
    const room1 = await this.cacheService.getRoom(roomId);

    if (!room1) {
      return this.cacheService.removePending(roomId);
    }

    const room2 = await this.cacheService.getRoom(room1.rivalRoomId);

    this.server.to(room1.rivalRoomId).emit('finish');
    this.server.to(room2.rivalRoomId).emit('finish');
  }

  async match(socket: Socket, userId: number) {
    const pendingList = await this.cacheService.getPendingList();

    console.log('Pending List', pendingList);

    if (!pendingList.length) {
      console.log('Added pending list ', socket.id);
      return this.cacheService.addPendingList(socket.id, userId);
    }

    // if (pendingList[0].userId === userId) return;

    const owner = await this.userService.getOne({ id: userId });
    const rival = await this.userService.getOne({ id: pendingList[0].userId });

    const room1: GameRoom = {
      user: owner,
      score: 0,
      rivalRoomId: pendingList[0].socketId,
    };

    const room2: GameRoom = {
      user: rival,
      score: 0,
      rivalRoomId: socket.id,
    };

    await Promise.all([
      this.cacheService.createRoom(socket.id, room1),
      this.cacheService.createRoom(pendingList[0].socketId, room2),
      this.cacheService.removePending(pendingList[0].socketId),
    ]);

    return this.startGame(room1, room2);
  }

  async createRoom() {
    const room: GameRoom = {
      user: {} as any,
      score: 0,
      rivalRoomId: '2',
    };
  }

  // async addPendingList(socket: Socket, userId: number) {
  //   const user = await this.userService.getOne({ id: userId });
  //   // await this.cacheService.addPandingUser(socket.id, user);
  //   // return;
  //   // if (!pending) {
  //   //   return this.cache.set('pending', { userId, socketId: socket.id });
  //   // }
  //   // await this.cache.del('pending');
  //   // const [opponent, owner] = await Promise.all([
  //   //   this.userService.getOne({ id: pending.userId }),
  //   //   this.userService.getOne({ id: userId }),
  //   // ]);

  //   // const scoreBoard: IScoreBoard = {
  //   //   [pending.socketId]: {
  //   //     user: opponent,
  //   //     score: 0,
  //   //   },
  //   //   [socket.id]: {
  //   //     user: owner,
  //   //     score: 0,
  //   //   },
  //   // };

  //   // await this.addScoreBoard(scoreBoard);
  //   // socket.emit('start', { socketId: pending.socketId, user: opponent });
  //   // socket
  //   //   .to(pending.socketId)
  //   //   .emit('start', { socketId: socket.id, user: owner });
  //   // console.log(await this.cache.get('scoreBoard'));
  // }
}
