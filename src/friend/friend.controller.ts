import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { User } from '../@decorators/user.decorator';
import { UserService } from '../user/user.service';
import { Friend, FriendStatus } from './entities/friend.entity';
import { UseAuth } from 'src/@decorators/auth.decorator';
import { IJwtPayload } from 'src/interfaces/jwt-payload';

@UseAuth()
@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(
    @User() currentUser: IJwtPayload,
    @Body() createFriendDto: CreateFriendDto,
  ) {
    createFriendDto.user = currentUser.id;
    return this.friendService.create(createFriendDto);
  }

  @Get()
  async findAll(
    @User() currentUser: IJwtPayload,
    @Query('status') status: string,
  ) {
    return await this.friendService.findAll({
      where: {
        user: {
          id: currentUser.id,
        },
        status: status,
      },
      relations: ['friend'],
    });
  }

  @Get('requests')
  async findRequests(@User() currentUser: IJwtPayload) {
    return await this.friendService.findAll({
      where: {
        friend: {
          id: currentUser.id,
        },
        status: FriendStatus.PENDING,
      },
      relations: ['user'],
    });
  }

  @Get('non-friends')
  async findNonFriends(@User() currentUser: IJwtPayload) {
    return await this.userService.findNonFriends(currentUser.id);
  }

  @Put('/accept/:id')
  async accept(@User() currentUser: IJwtPayload, @Param('id') id: number) {
    const friend: Friend = await this.friendService.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    await this.friendService.create({
      user: currentUser.id,
      friend: friend.user.valueOf(),
      status: FriendStatus.ACCEPTED,
    });

    return await this.friendService.update(id, {
      status: FriendStatus.ACCEPTED,
    });
  }

  @Put('/reject/:id')
  async reject(@Param('id') id: number) {
    return await this.friendService.update(id, {
      status: FriendStatus.REJECTED,
    });
  }
}
