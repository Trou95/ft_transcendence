import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelUser } from '../friend/entities/channel-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelUser])],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
