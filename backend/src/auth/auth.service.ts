import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import LoginDto from './dto/login.dto';
import axios from 'axios';
import IntraApiService from '../intra-api/intra-api.service';
//import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const response = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id:
        'u-s4t2ud-d0d6f07e77b6d817c87f598f3fa9c5061f95bcc2a98e17026bc282138ab8d49a',
      client_secret:
        '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',
      code: loginDto.code,
      redirect_uri: 'http://localhost:4242/auth/callback',
    });

    const intraApiService = new IntraApiService(response.data.access_token);

    const { data } = await intraApiService.getMe();

    console.log(data);

    const payload = { data };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
