import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IPendingUser } from 'src/interfaces/pending-user.interface';
import { User } from 'src/user/user.entity';

enum CacheType {
  PENDING_USER = 'PENDING_USER',
  SCORE_BOARD = 'SCORE_BOARD',
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  private async setCache(key: string, value: unknown) {
    return this.cache.set(key, value, 0);
  }

  private async getCache<T>(key: string) {
    return (await this.cache.get<T>(key)) || [];
  }

  async addPandingUser(socketId: string, user: User) {
    const pending = await this.getCache<IPendingUser[]>(CacheType.PENDING_USER);
    pending.push({ socketId, user });
    return this.setCache(CacheType.PENDING_USER, pending);
  }

  async removePendingUser(socketId: string) {
    const pending = await this.getCache<IPendingUser[]>(CacheType.PENDING_USER);
    const filter = pending.filter((x) => x.socketId !== socketId);
    return this.setCache(CacheType.PENDING_USER, filter);
  }

  async getAllPendingUser() {
    return this.getCache<IPendingUser[]>(CacheType.PENDING_USER);
  }
}
