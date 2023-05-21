import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateFriendDto {
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @IsNumber()
  @IsNotEmpty()
  friend: number;
}
