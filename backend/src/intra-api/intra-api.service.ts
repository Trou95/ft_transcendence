import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import LoginDto from '../auth/dto/login.dto';
import * as process from 'process';

@Injectable()
export default class IntraApiService {
  private intraApiService: any;
  constructor(token: string) {
    if (!token) {
      throw new BadRequestException();
    }

    this.intraApiService = axios.create({
      baseURL: process.env.INTRA_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getMe(): Promise<any> {
    try {
      return await this.intraApiService.get('/me');
    } catch (err) {
      return err;
    }
  }
}
