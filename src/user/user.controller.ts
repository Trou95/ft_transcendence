import {Controller, Get, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import {AuthGuard} from "@nestjs/passport";
import { User } from '../@decorators/user.decorator';
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get("match-history")
  async getMatchHistory(@User() user){
    const res =  await this.userService.getMatchHistory(user.id);
    //console.log(res);
    return await this.userService.getMatchHistory(user.id);
  }

  @Get("leaders")
  async getTotalWins() {
    return await this.userService.getTotalWins();
  }
}
