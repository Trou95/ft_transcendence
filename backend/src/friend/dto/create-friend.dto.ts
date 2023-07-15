import {
  IS_ENUM,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../user/user.entity';
import { FriendStatus } from '../entities/friend.entity';

export class CreateFriendDto {
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @IsNumber()
  @IsNotEmpty()
  friend: number;

  @IsEnum(FriendStatus)
  status: FriendStatus;
}
