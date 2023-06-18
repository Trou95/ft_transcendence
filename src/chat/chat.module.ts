import { ChatGateway } from './chat.gateway';
import { Module } from '@nestjs/common';
import { ChannelModule } from '../channel/channel.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../channel/entities/channel.entity';
import { ChannelUser } from '../friend/entities/channel-user.entity';
import { ChannelService } from '../channel/channel.service';

@Module({
  imports: [ChannelModule, TypeOrmModule.forFeature([Channel, ChannelUser])],
  providers: [ChatGateway, ChannelService],
})
export class ChatModule {}
