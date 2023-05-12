import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  async createJwt(jwtData: object, expiresIn: number) {
    return this.jwtService.sign(jwtData, { expiresIn });
  }

  verifyJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
