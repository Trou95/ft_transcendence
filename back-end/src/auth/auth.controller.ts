import axios from 'axios';
import config from 'src/config';
import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CallbackDto } from './dto/callback.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async callback(@Query() query: CallbackDto) {
    try {
      const res = axios.post(
        config.intra.tokenUrl,
        {
          grant_type: 'authorization_code',
          client_id: config.intra.clientId,
          client_secret: config.intra.clientSecret,
          redirect_url: config.intra.redirectUrl,
          code: query.code,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'identity',
          },
        },
      );

    } catch (error) {}
  }
}
