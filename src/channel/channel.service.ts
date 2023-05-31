import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { ChannelUser } from '../friend/entities/channel-user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
  ) {}

  async create(currentUser: any, createChannelDto: CreateChannelDto) {
    const channel = await this.channelRepository.insert(createChannelDto);
    await this.channelUserRepository.insert({
      channel: channel.identifiers[0].id,
      user: currentUser.id,
      is_owner: true,
      is_admin: true,
    });

    return channel;
  }

  async findAll(query: any) {
    return await this.channelRepository.find(query);
  }

  async findOne(query: any) {
    return await this.channelRepository.findOne(query);
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    return await this.channelRepository.update({ id }, updateChannelDto);
  }

  async remove(id: number) {
    return await this.channelRepository.delete({ id });
  }
}
