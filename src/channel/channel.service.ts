import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async addMember(currentUser: any, id: number, body: any) {
    const channelId = parseInt(id.toString());
    const user = await this.channelUserRepository.findOne({
      where: {
        channel: {
          id: 10,
        },
        user: {
          id: currentUser.id,
        },
      },
      relations: ['user', 'channel'],
    });

    if (!user) {
      throw new ForbiddenException("You don't have permission to add members.");
    }

    await this.channelUserRepository.insert({
      channel: {
        id: channelId,
      },
      user: body.userId,
    });
  }

  async findAll(query: any) {
    return await this.channelUserRepository.find(query);
  }

  async findMembers(id: number) {
    const channelId = parseInt(id.toString());
    return await this.channelUserRepository.find({
      where: {
        channel: {
          id: channelId,
        },
      },
      relations: ['user'],
    });
  }

  async findOne(query: any) {
    return await this.channelRepository.findOne(query);
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    return await this.channelRepository.update({ id }, updateChannelDto);
  }

  async remove(id: number) {
    await this.channelUserRepository.delete({ channel: { id } });
    return await this.channelRepository.delete({ id });
  }
}
