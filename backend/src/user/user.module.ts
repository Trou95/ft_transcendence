import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenModule } from '../token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import {MatchModule} from "../match/match.module";

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), TokenModule, MatchModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
