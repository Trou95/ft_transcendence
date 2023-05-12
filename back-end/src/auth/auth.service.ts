import { Injectable } from '@nestjs/common';
import { IntraApiService } from '../intraApi/intraApi.service';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { TokenService } from '../token/token.service';
import config from '../config';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}
  async callback(code: string) {
    const tokenData = await this.getToken(code);

    const intraApiService = new IntraApiService(tokenData);
    const user = await intraApiService.getMe();

    const userData: UserDto = intraApiService.parseUser(user);
    const intra_id: any = userData.intra_id;

    const isUserExist = await this.userService.isIntraUserExist(intra_id);

    if (!isUserExist) await this.userService.create(userData);
    else await this.userService.update(userData, user.id);

    const access_token = this.tokenService.createJwt(
      {
        id: user.id,
        intra_id,
      },
      1000 * 60 * 10,
    );

    return access_token;
  }

  async myAccount(id) {
    const user = await this.userService.get(id);
    return user;
  }

  async getToken(code: string) {
    try {
      const res: any = await axios.post(
        process.env.TOKEN_URL,
        {
          grant_type: 'authorization_code',
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URL,
          code,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'identity',
          },
        },
      );
      return res.data;
    } catch (error) {}
  }
}
