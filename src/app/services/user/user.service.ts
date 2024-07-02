import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDataInput, LoginDataInput } from 'src/app/dtos';
import { UserFactory } from 'src/app/factories';
import { User } from 'src/app/models';
import { ConfigData } from 'src/app/shared';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userFactory: UserFactory,
    private readonly configData: ConfigData,
    private readonly authService: AuthService,
  ) {}

  async crateUser(req: CreateDataInput) {
    try {
      let user = await this.userFactory.convertCreateRequestInputToModel(req);
      user = this.configData.createdData(user);
      console.log('user::', user);
      await this.userRepo.save(user);
    } catch (err) {
      throw err;
    }
  }

  async login(req: LoginDataInput) {
    try {
      const user = await this.userRepo.findOneBy({
        email: req.email,
      });

      if (!this.authService.comparePasswords(req.password, user?.password)) {
        throw new UnauthorizedException();
      }
      const payload = { id: user.id, email: user.email };

      return {
        accessToken: await this.authService.generateAccessToken(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
