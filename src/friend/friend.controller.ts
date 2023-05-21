import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../@decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  create(@User() currentUser, @Body() createFriendDto: CreateFriendDto) {
    console.log(currentUser);
    createFriendDto.user = 5;
    console.log(createFriendDto);
    return this.friendService.create(createFriendDto);
  }

  @Get()
  findAll(@User() currentUser) {
    return this.friendService.findAll({
      where: {
        user: {
          id: currentUser.id,
        },
        status: 'accepted',
      },
      relations: ['friend'],
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(+id);
  }
}
