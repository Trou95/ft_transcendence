import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';

@Entity()
export class ChannelUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  is_banned: boolean;

  @Column({ default: false })
  is_muted: boolean;
}
