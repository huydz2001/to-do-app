import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ADMIN_ID } from 'src/app/common';
import {
  CreateDataInput,
  CreateUserResponse,
  LoginDataInput,
  LoginResponse,
} from 'src/app/dtos';
import { UserFactory } from 'src/app/factories';
import { User } from 'src/app/models';
import { ConfigData } from 'src/app/shared';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userFactory: UserFactory,
    private readonly configData: ConfigData,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async crateUser(req: CreateDataInput): Promise<CreateUserResponse> {
    try {
      const [findUserByEmail, findUserByUsername] = await Promise.all([
        this.userRepo.findOneBy({ email: req.email }),
        this.userRepo.findOneBy({ user_name: req.user_name }),
      ]);

      if (findUserByEmail) {
        throw new BadRequestException('Email da ton tai');
      }

      if (findUserByUsername) {
        throw new BadRequestException('Username da ton tai');
      }

      let user = await this.userFactory.convertCreateRequestInputToModel(req);
      user = this.configData.createdData(ADMIN_ID, user);
      await this.userRepo.save(user);

      const { id, email, user_name, ...userInfor } = user;
      return new CreateUserResponse(id, email, user_name);
    } catch (err) {
      throw err;
    }
  }

  async login(req: LoginDataInput): Promise<LoginResponse> {
    try {
      const user = await this.userRepo.findOneBy({
        email: req.email,
      });

      if (!user) {
        throw new HttpException('Email khong ton tai', 400);
      } else if (
        (await this.comparePasswords(req.password, user!.password)) == false
      ) {
        throw new HttpException('Sai mat khau', 400);
      }

      const payload = { id: user.id, email: user.email };
      const accessToken = await this.generateAccessToken(payload);

      return new LoginResponse(accessToken);
    } catch (error) {
      throw error;
    }
  }

  private async generateAccessToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SIGN_SECRET'),
    });
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
