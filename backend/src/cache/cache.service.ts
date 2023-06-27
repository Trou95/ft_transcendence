import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GameRoom } from 'src/game/game.service';
import { IPendingUser } from 'src/interfaces/pending-user.interface';
import { User } from 'src/user/user.entity';

enum CacheType {
  PENDING = 'PENDING',
  SCORE_BOARD = 'SCORE_BOARD',
  ROOM = 'ROOM',
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async setCache(key: string, value: unknown) {
    return this.cache.set(key, value, 0);
  }

  async getCaches() {
    return this.cache.store.keys();
  }

  async getCache<T>(key: string) {
    return this.cache.get<T>(key);
  }

  async delCache<T>(key: string) {
    await this.cache.del(key);
  }

  // ------------------------

 /*
  async getPendingList() {
    return (await this.getCache<IPendingUser[]>(CacheType.PENDING)) || [];
  }

  async addPendingList(socketId: string, userId: number) {
    const list = await this.getPendingList();
    list.push({ socketId, userId });
    this.setCache(CacheType.PENDING, list);
  }

  async removePending(socketId: string) {
    const list = await this.getPendingList();
    const newList = list.filter((x) => x.socketId !== socketId);
    return this.setCache(CacheType.PENDING, newList);
  }

  // ------------------------

  async getRoom(id: string) {
    return this.getCache<GameRoom>(id);
  }


  async createRoom(id: string, room: GameRoom) {
    return this.setCache(id, room);
  }

  async assingUserToRoom(roomId: string, rivalRoomId: string) {
    const room = await this.getCache<GameRoom>(roomId);
    room.rivalRoomId = rivalRoomId;
    return this.setCache(roomId, room);
  }

  async removeRoom(roomId: string) {
    const room = await this.getCache<GameRoom>(roomId);

    await Promise.all([
      this.cache.del(roomId),
      this.cache.del(room.rivalRoomId),
    ]);
  }

   */
}
