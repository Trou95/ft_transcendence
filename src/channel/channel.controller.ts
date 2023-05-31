import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../@decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@User() currentUser: any, @Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(currentUser, createChannelDto);
  }

  @Get()
  async findAll() {
    return await this.channelService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.channelService.findOne({
      where: { id },
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}
