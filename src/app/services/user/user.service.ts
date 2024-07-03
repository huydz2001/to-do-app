import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { User } from 'src/app/models';
import { ConfigData } from 'src/app/shared';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userFactory: UserFactory,
    private readonly configData: ConfigData,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getUsers() {
    return this.userRepo.find();
  }
}
