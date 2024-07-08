import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { User, Group } from 'src/app/models';
import { ConfigData, RequestService } from 'src/app/shared';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userFactory: UserFactory,
    private readonly configData: ConfigData,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly requestService: RequestService,
  ) {}

  getUsers() {
    console.log(this.requestService.getUserId());

    return this.userRepo.find({
      relations: {
        group: true,
        tasks: true,
      },
    });
  }

  findById(id: number) {
    return this.userRepo.findOneBy({ id: id });
  }

  findByIds(ids: number[]) {
    return this.userRepo.findBy({ id: In(ids) });
  }
}
