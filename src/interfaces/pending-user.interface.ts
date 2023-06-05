import { User } from 'src/user/user.entity';

export interface IPendingUser {
  user: User;
  socketId: string;
}
