import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Friend } from '../friend/entities/friend.entity';
import { ChannelUser } from '../friend/entities/channel-user.entity';
import {Match} from "../match/entities/match.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  intra_id: number;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @OneToMany(() => Friend, (friend) => friend.friend)
  @JoinColumn()
  friends: Friend[];

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
  @JoinColumn()
  channels: ChannelUser[];

}