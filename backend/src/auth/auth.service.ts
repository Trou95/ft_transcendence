import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { TokenService } from '../token/token.service';
import { IntraService } from 'src/intra/intra.service';
import { CallbackDto } from './dto/callback.dto';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly intraService: IntraService,
    private readonly cacheService: CacheService,
  ) {}

  async callback(body: CallbackDto) {
    const secretCache = await this.cacheService.getTwoFactorAuthCache();

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
    let secret = await this.cacheService.getTwoFactorAuthCache();

    if (!secret) {
      secret = speakeasy.generateSecret({
        name: 'Ebul Feth',
      });
      await this.cacheService.setTwoFactorAuthCache(secret);
    }

    return qrcode.toDataURL(secret.otpauth_url);
  }
}
