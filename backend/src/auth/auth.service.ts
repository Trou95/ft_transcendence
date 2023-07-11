import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { TokenService } from '../token/token.service';
import { IntraService } from 'src/intra/intra.service';
import { CallbackDto } from './dto/callback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleAuthenticator } from './2FA/google-auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(GoogleAuthenticator)
    private readonly googleAuth: Repository<GoogleAuthenticator>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly intraService: IntraService,
  ) {}

  async callback(body: CallbackDto) {
    const secretCache = (await this.googleAuth.find())[0];

    if (!secretCache) {
      throw new UnauthorizedException();
    }

    const isVerified = speakeasy.totp.verify({
      secret: secretCache.ascii,
      encoding: 'ascii',
      token: body.twoFactorAuthCode,
    });

    if (!isVerified) {
      throw new UnauthorizedException();
    }

    const intraUser = await this.intraService.getMe(body.code);

    const userData: UserDto = this.intraService.parseUser(intraUser);
    const intra_id = userData.intra_id;

    const isUserExist = await this.userService.isExist({ intra_id });

    if (!isUserExist) await this.userService.create(userData);
    else await this.userService.update(userData, intraUser.id);

    const user = await this.userService.getOne({ intra_id });

    const accessToken = this.tokenService.createJwt({
      id: user.id,
      token: intraUser.token,
    });

    return { user, token: accessToken };
  }

  async myAccount(id: number) {
    return await this.userService.getOne({ id });
  }

  async getTwoFactorQrCode() {
    const secret = (await this.googleAuth.find())[0];

    if (!secret) {
      const newSecret = speakeasy.generateSecret({
        name: 'Ebul Feth',
      });

      await this.googleAuth.save(newSecret);
      return qrcode.toDataURL(newSecret.otpauth_url);
    }

    return qrcode.toDataURL(secret.otpauth_url);
  }
}
