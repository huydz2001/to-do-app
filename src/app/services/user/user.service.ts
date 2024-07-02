import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDataInput } from 'src/app/dtos';
import { User } from 'src/app/models';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async crateUser(user: User) {
    await this.userRepo.save(user);
  }
}
