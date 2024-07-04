import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
      const existingUser = await this.userRepo.findOne({
        where: [{ user_name: req.user_name }],
      });

      if (existingUser) {
        return new CreateUserResponse(
          HttpStatus.BAD_REQUEST,
          false,
          existingUser.email == req.email
            ? 'Email already exist'
            : 'Username already exist',
          [
            {
              field: existingUser.email == req.email ? 'email' : 'user_name',
              message: `${existingUser.email == req.email ? 'email' : 'user_name'} already exist`,
            },
          ],
          null,
        );
      }

      let user = await this.userFactory.convertCreateRequestInputToModel(req);
      user = this.configData.createdData(ADMIN_ID, user);
      await this.userRepo.save(user);

      const { id, email, user_name, ...userInfor } = user;
      return new CreateUserResponse(
        HttpStatus.OK,
        true,
        'Register user success',
        [],
        {
          id: id,
          email: email,
          username: user_name,
        },
      );
    } catch (err) {
      throw err;
    }
  }

  async login(req: LoginDataInput): Promise<LoginResponse> {
    try {
      const user = await this.userRepo.findOneBy(
        req.emailOrUsername.includes('@')
          ? { email: req.emailOrUsername }
          : { user_name: req.emailOrUsername },
      );

      if (!user) {
        return new LoginResponse(
          HttpStatus.OK,
          true,
          'User not found',
          [
            {
              field: 'emailOrUsername',
              message: 'Email or Username incorrect',
            },
          ],
          null,
        );
      }

      const isMatchPass = await this.comparePasswords(
        req.password,
        user!.password,
      );

      if (isMatchPass == false) {
        return new LoginResponse(
          HttpStatus.OK,
          true,
          'Wrong password',
          [
            {
              field: 'password',
              message: 'Password incorrect',
            },
          ],
          null,
        );
      }

      const payload = { id: user.id, email: user.email };
      const accessToken = await this.generateAccessToken(payload);

      return new LoginResponse(
        HttpStatus.OK,
        true,
        'Login success',
        null,
        accessToken,
      );
    } catch (error) {}
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
