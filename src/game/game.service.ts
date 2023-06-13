import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { CacheService } from 'src/cache/cache.service';
import { IPendingUser } from 'src/interfaces/pending-user.interface';
import { User } from 'src/user/user.entity';
import Room from "./entities/room.entity";
import {Game} from "./entities/game.entity";

export interface GameRoom {
  user: User;
  score: number;
  rivalRoomId: string;
}

const ROOM_PREFIX = "R-";
const GAME_PREFIX = "G-";

@Injectable()
export class GameService {

  private gamePlayers : Map<string, string>;

  private readonly PLAYER_WIDTH_SCALE = 0.01;
  private readonly PLAYER_HEIGTH_SCALE = 0.25;
  private readonly BALL_SPEED = 1920 * 0.008;
  private readonly BALL_RADIUS = 1920 * 0.01;

  private playerMarginX = 10;
  private playerPosY = (1920 / 2) - (1920 * this.PLAYER_HEIGTH_SCALE) / 2;

  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  )
  {
    this.gamePlayers = new Map();
  }

  public server: Server;

  async startGame(owner: GameRoom, rival: GameRoom) {
    this.server.to(owner.rivalRoomId).emit('start', owner.user);
    this.server.to(rival.rivalRoomId).emit('start', rival.user);
  }

  async finishGame(roomId: string) {
    /*const room1 = await this.cacheService.getRoom(roomId);

    if (!room1) {
      return this.cacheService.removePending(roomId);

    }

    const room2 = await this.cacheService.getRoom(room1.rivalRoomId);

    this.server.to(room1.rivalRoomId).emit('finish');
    this.server.to(room2.rivalRoomId).emit('finish');
    */
  }

  async match(socket: Socket, userId: number) {
    await this.findWaitRoom(socket, userId);
  }


  async findWaitRoom(socket : Socket, userId : number) {
    const rooms = await this.findRooms();
    for(let i = rooms.length - 1; i >= 0; i--)
    {
      const room : Room = await this.cacheService.getCache(rooms[i]);
      if(room.player2 == null) {
        room.player2 = socket.id;
        room.player2_id = userId;
        const user1 = await this.getUser(room.player1_id);
        const user2 = await this.getUser(room.player2_id);
        const gameIndex = await this.createGameRoom(room.player1, {
          player1: room.player1, player2: room.player2,
          player1_id: room.player1_id, player2_id: userId,
        });
        //Todo: gamestatus fix
        const game = await this.getGameRoom(gameIndex);
        game.gameStatus = 1;

        console.log(game.gameStatus);
        console.log("Game Created: ", gameIndex);
        await this.gamePlayers.set(room.player1, gameIndex);
        await this.gamePlayers.set(room.player2, gameIndex);
        socket.emit("client:startGame", user1);
        socket.to(room.player1).emit("client:startGame", user2);
        return;
      }
    }
    await this.createRoom(socket.id,
        {player1: socket.id, player1_id: userId, player2: null});
  }

  async createGameRoom(key: string, gameRoom : Game)
  {
    key = GAME_PREFIX + key;

    gameRoom.player1_pos = {
      X: this.playerMarginX,
      Y: this.playerPosY,
    };
    gameRoom.player2_pos = {
      X: 1920 - this.playerMarginX,
      Y: this.playerPosY,
    };

    gameRoom.ball_pos = {
      X: 1920 / 2,
      Y: 1080 / 2,
    };
    gameRoom.ball_speed = this.BALL_SPEED;
    gameRoom.gameStatus = 0;

    await this.cacheService.setCache(key, gameRoom);
    return key;
  }

  async getGameRoom(key : string) : Promise<Game>
  {
    return this.cacheService.getCache(key);
  }

  async getGamePlayers()
  {
    return this.gamePlayers;
  }

  async getGameRooms()
  {
    const ret = await this.cacheService.getCaches();
    return ret.filter(room => room.startsWith(GAME_PREFIX));
  }

  async createRoom(key : string , room : Room) {
    console.log("Room Created: ", ROOM_PREFIX + key);
    await this.cacheService.setCache(ROOM_PREFIX + key, room);
  }
  async findRooms() : Promise<string[]>
  {
    const ret = await this.cacheService.getCaches();
    return ret.filter(room => room.startsWith(ROOM_PREFIX));
  }

  async deleteRoom(key : string) {
    key = ROOM_PREFIX + key;
    const rooms = await this.findRooms();
    const index = rooms.indexOf(key);
    if(index != -1) {
      await this.cacheService.delCache(key);
      console.log("Room Deleted Succesfully", key);
    }
  }
  async getUser(id : number)
  {
    return await this.userService.getOne({id: id});
  }

  /*
  async createRoom() {
    const room: GameRoom = {
      user: {} as any,
      score: 0,
      rivalRoomId: '2',
    };
  }
  */

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
