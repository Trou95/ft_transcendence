import { IsNotEmpty } from 'class-validator';

export default class LoginDto {
  @IsNotEmpty()
  code: string;
}
