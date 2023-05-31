import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { Channel } from '../../channel/entities/channel.entity';

@Entity()
export class ChannelUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Channel)
  @JoinColumn({ name: 'channel_id' })
  channel: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @Column({ default: false })
  is_owner: boolean;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  is_banned: boolean;

  @Column({ default: false })
  is_muted: boolean;
}
