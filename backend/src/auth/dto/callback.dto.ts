import { IsNotEmpty, IsString } from 'class-validator';

export class CallbackDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  twoFactorAuthCode: string;
}
