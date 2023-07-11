import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GeneratedSecret } from 'speakeasy';

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

  async delCache(key: string) {
    await this.cache.del(key);
  }

  async setTwoFactorAuthCache(secret: GeneratedSecret) {
    return this.setCache('AUTH_SECRET_2FA', secret);
  }

  async getTwoFactorAuthCache() {
    return this.getCache<GeneratedSecret>('AUTH_SECRET_2FA');
  }
}
