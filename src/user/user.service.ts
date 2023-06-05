import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async isExist(where: FindOptionsWhere<User>) {
    return this.repository.exist({ where });
  }

  async getOne(where: FindOptionsWhere<User>): Promise<User> {
    return await this.repository.findOneBy(where);
  }

  async getAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findNonFriends(id: number) {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.friends', 'friend')
      .where('user.id != :userId', { userId: id })
      .andWhere('friend.id IS NULL')
      .getMany();
  }

  async create(user: UserDto): Promise<InsertResult> {
    return await this.repository.insert(user);
  }

  async update(data: UserDto, where: any): Promise<UpdateResult> {
    return await this.repository.update(where, data);
  }

  async delete(where: any): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
