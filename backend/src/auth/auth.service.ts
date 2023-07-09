import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { TokenService } from '../token/token.service';
import { IntraService } from 'src/intra/intra.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly intraService: IntraService,
  ) {}

  async callback(code: string) {
    const intraUser = await this.intraService.getMe(code);

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
}
