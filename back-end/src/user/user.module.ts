import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenModule } from '../token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), TokenModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
