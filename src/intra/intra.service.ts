import config from 'src/config';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto/user.dto';
import { IIntraToken } from './intra-token.interface';

@Injectable()
export class IntraService {
  private readonly intraApiService = axios.create({
    baseURL: config.intra.apiUrl,
  });

  private async setIntraToken(code: string) {
    const res = await axios.post(
      config.intra.tokenUrl,
      {
        grant_type: 'authorization_code',
        client_id: config.intra.clientId,
        client_secret: config.intra.clientSecret,
        redirect_uri: config.intra.redirectUrl,
        code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'identity',
        },
      },
    );
    const token: IIntraToken = res.data;

    this.intraApiService.defaults.headers.common.Authorization = `Bearer ${token.access_token}`;
  }

  async getMe(code: string): Promise<any> {
    await this.setIntraToken(code);

    const res = await this.intraApiService.get('/me');
    return res.data;
  }

  parseUser(user: any): UserDto {
    return {
      intra_id: user.id,
      full_name: user.displayname,
      email: user.email,
      avatar: user.image.link,
    };
  }
}
