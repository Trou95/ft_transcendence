import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsString()
  avatar: string;
}
