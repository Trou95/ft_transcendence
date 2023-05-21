import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { User } from './user/user.entity';
import { config as dotenv } from 'dotenv';
dotenv({ path: `.env` });
import config from './config';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { Friend } from './friend/entities/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Friend],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    TokenModule,
    ChatModule,
    FriendModule,
  ],
})
export class AppModule {}
