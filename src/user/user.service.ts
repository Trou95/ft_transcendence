import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async isIntraUserExist(id) {
    const res = await this.get({
      intra_id: id,
    });
    return res != null;
  }
  async get(where: any): Promise<User> {
    return await this.userRepository.findOneBy(where);
  }
  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findNonFriends(id: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.friends', 'friend')
      .where('user.id != :userId', { userId: id })
      .andWhere('friend.id IS NULL')
      .getMany();
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
}
