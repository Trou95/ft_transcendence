import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { IntraModule } from 'src/intra/intra.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [AuthController],
  imports: [UserModule, TokenModule, IntraModule, CacheModule],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
