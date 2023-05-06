import axios, { AxiosInstance } from 'axios';
import config from '../config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { intraTokenDto } from './dto/intraToken.dto';

@Injectable()
export class IntraApiService {
  private readonly intraApiService: AxiosInstance;
  constructor(token: intraTokenDto) {
    if (!token) throw new BadRequestException();

    this.intraApiService = axios.create({
      baseURL: config.intra.apiUrl,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
  }
  async getMe(): Promise<any> {
    try {
      const res = await this.intraApiService.get('/me');
      return res.data;
    } catch (error) {
      console.log('ERROR', error);
    }
  }
}
