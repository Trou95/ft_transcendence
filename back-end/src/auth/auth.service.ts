import { Injectable } from '@nestjs/common';
import { IntraApiService } from '../intraApi/intraApi.service';
import { intraTokenDto } from '../intraApi/dto/intraToken.dto';

@Injectable()
export class AuthService {
  async callback(token: intraTokenDto) {
    const intraApiService = new IntraApiService(token);

    const user = await intraApiService.getMe();
  }
}
