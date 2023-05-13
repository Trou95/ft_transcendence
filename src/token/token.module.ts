import config from 'src/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: '123',
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
