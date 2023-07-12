import {Injectable, NotFoundException} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsWhere,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './user.entity';
import { ChannelUser } from '../friend/entities/channel-user.entity';
import { Friend } from '../friend/entities/friend.entity';
import {MatchService} from "../match/match.service";
import {IntraService} from "../intra/intra.service";
import {UpdateProfileDto} from "./dto/update-profile.dto";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly intraService: IntraService,
    private readonly matchService: MatchService,
  ) {}

  async isExist(where: FindOptionsWhere<User>) {
    return this.userRepository.exist({ where });
  }

  async getOne(where: FindOptionsWhere<User>): Promise<User> {
    return await this.userRepository.findOneBy(where);
  }

  async findOne(query: any) : Promise<User> {
    return await this.userRepository.findOne(query);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findNonFriends(id: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.friends', 'friend')
      .where('user.id != :userId', { userId: id })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('friend.friend')
          .from(Friend, 'friend')
          .where('friend.user = :userId', { userId: id })
          .getQuery();

        return 'user.id NOT IN ' + subQuery;
      })
      .getMany();
  }

  async findNonChannelMembers(currentUser: any, id: number) {
    console.log(currentUser, id);
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId: currentUser.id })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('channelUser.user')
          .from(ChannelUser, 'channelUser')
          .where('channelUser.channel = :channelId', { channelId: id })
          .getQuery();

        return 'user.id NOT IN ' + subQuery;
      })
      .getMany();
  }

  async getMatchHistory(id: number, limit?: number) {
    return await this.matchService.getMatchHistory(id, limit);
  }

  async getTotalWins() {
    return await this.matchService.getTotalWins();
  }

  async create(user: UserDto): Promise<InsertResult> {
    return await this.userRepository.insert(user);
  }

  async update(data: UserDto, where: any): Promise<UpdateResult> {
    return await this.userRepository.update(where, data);
  }

  async delete(where: any): Promise<DeleteResult> {
    return await this.userRepository.delete(where);
  }

  async getUser(user: string, token: string) {
    const res = await this.intraService.getUser(user, token);
    return res;
  }

  async updateProfile(user_id: number, data: UpdateProfileDto) {
    return await this.userRepository.update({id: user_id}, data);
  }


}
