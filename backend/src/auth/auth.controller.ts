import config from 'src/config';
import {
  Controller,
  Get,
  Request,
  Query,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CallbackDto } from './dto/callback.dto';
import { UseAuth } from 'src/@decorators/auth.decorator';
import { User } from 'src/@decorators/user.decorator';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('callback')
  async callback(@Body() body: CallbackDto) {
    return await this.authService.callback(body.code);
  }

  @UseAuth()
  @Get('my-account')
  myAccount(@User() user: IJwtPayload) {
    return this.authService.myAccount(user.id);
  }
}
