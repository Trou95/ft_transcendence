import {
  Body,
  Controller,
  Get,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../@decorators/user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('match-history')
  async getMatchHistory(@User() user: IJwtPayload) {
    return await this.userService.getMatchHistory(user.id);
  }

  @Get('leaders')
  async getTotalWins() {
    return await this.userService.getTotalWins();
  }

  @Put('update-profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @User() user: IJwtPayload,
    @Body() data: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.updateProfile(user.id, data, file);
  }
}
