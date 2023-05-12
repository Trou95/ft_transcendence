import axios, { AxiosInstance } from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { intraTokenDto } from './dto/intraToken.dto';
import { UserDto } from '../user/dto/user.dto';
import * as process from 'process';

@Injectable()
export class IntraApiService {
  private readonly intraApiService: AxiosInstance;
  constructor(token: intraTokenDto) {
    if (!token) throw new BadRequestException();

    this.intraApiService = axios.create({
      baseURL: process.env.API_URL,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
  }
  async getMe(): Promise<any> {
    try {
      const res = await this.intraApiService.get('/me');
      return res.data;
    } catch (error) {}
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
