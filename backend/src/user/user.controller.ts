import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() user: CreateUserDto) {
    console.log(user);
    return await this.userService.create(user);
  }

  @Get('')
  async getUsers() {
    return await this.userService.getAll();
  }
}
