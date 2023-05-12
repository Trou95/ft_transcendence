import config from 'src/config';
import { Controller, Get, Request, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CallbackDto } from './dto/callback.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async callback(@Query() query: CallbackDto) {
    try {
      const access_token = await this.authService.callback(query.code);
      return access_token;
    } catch (error) {
      console.log(error);
    }
  }

  @Get('my-account')
  @UseGuards(AuthGuard('jwt'))
  myAccount(@Request() req) {
    const user = this.authService.myAccount(req.user.id);
    return user;
  }
}
