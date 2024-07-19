import { HttpStatus, Injectable } from '@nestjs/common';
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
  LogoutResponse,
  RefreshTokenResponse,
} from 'src/app/dtos';
import { Token, User } from 'src/app/entities';
import { UserFactory } from 'src/app/factories';
import { ConfigData, RequestService } from 'src/app/shared';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
    private readonly userFactory: UserFactory,
    private readonly configData: ConfigData,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async crateUser(req: CreateDataInput): Promise<CreateUserResponse> {
    try {
      const existingUser = await this.userRepo.findOne({
        where: [{ name: req.name }],
      });

      if (existingUser) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message:
            existingUser.email == req.email
              ? 'Email already exist'
              : 'Username already exist',
          errors: [
            {
              field: existingUser.email == req.email ? 'email' : 'name',
              message: `${existingUser.email == req.email ? 'email' : 'name'} already exist`,
            },
          ],
          user: null,
        };
      }

      let user = await this.userFactory.convertCreateRequestInputToModel(req);
      user = this.configData.createdData(user);
      await this.userRepo.save(user);

      const { id, email, name, ...userInfor } = user;
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Register user success',
        errors: [],
        user: {
          id: id,
          email: email,
          username: name,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async logOut(userId: number): Promise<LogoutResponse> {
    try {
      await this.tokenRepo.delete({ userId: userId });
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Logout success',
        errors: [],
        id: userId,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(req: LoginDataInput, res: Response): Promise<LoginResponse> {
    try {
      const user = await this.userRepo.findOne({
        where: req.emailOrUsername.includes('@')
          ? { email: req.emailOrUsername }
          : { name: req.emailOrUsername },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          status: true,
        },
      });

      if (!user) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: true,
          message: 'Email or Password incorrect',
          errors: [
            {
              field: 'emailOrUsername',
              message: 'Email or Username incorrect',
            },
          ],
          accessToken: null,
          refreshToken: null,
        };
      }

      const isMatchPass = await this.comparePasswords(
        req.password,
        user!.password,
      );

      if (isMatchPass == false) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: true,
          message: 'Wrong password',
          errors: [
            {
              field: 'password',
              message: 'Password incorrect',
            },
          ],
          accessToken: null,
          refreshToken: null,
        };
      }

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
      };
      const { accessToken, refreshToken } = await this.generateToken(payload);

      await this.storeRefreshToken(refreshToken, user.id);

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Login success',
        errors: [],
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(token: string): Promise<RefreshTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SIGN_REFRESH_SECRET'),
      });

      if (!payload) {
        return {
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Unauthorized',
          errors: [
            {
              field: 'refreshToken',
              message: 'Invalid RefreshToken. Please login!',
            },
          ],
          accessToken: null,
          refreshToken: null,
        };
      }

      const existToken = this.tokenRepo.findOne({
        where: { userId: payload.id, token: token },
      });

      if (!existToken) {
        return {
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Unauthorized',
          errors: [
            {
              field: 'refreshToken',
              message: 'Invalid RefreshToken',
            },
          ],
          accessToken: null,
          refreshToken: null,
        };
      }

      const { accessToken, refreshToken } = await this.generateToken({
        id: payload.id,
        email: payload.email,
        name: payload.name,
        status: payload.status,
      });

      await this.storeRefreshToken(refreshToken, payload.id);

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'RefreshToken success',
        errors: [],
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      const errors = [];
      if (error.name === 'JsonWebTokenError') {
        errors.push({
          field: 'refreshToken',
          message: 'Invalid RefreshToken',
        });
      } else if (error.name === 'TokenExpiredError') {
        errors.push({
          field: 'refreshToken',
          message: 'Refresh token has expired',
        });
      } else {
        throw error;
      }
    }
  }

  async getTokenByUserId(userId: number) {
    return await this.tokenRepo.findOne({ where: { userId: userId } });
  }

  async revokeToken(userId: number) {
    await this.tokenRepo.delete({ userId: userId });
  }

  private async generateToken(payload: any): Promise<any> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60,
      secret: this.configService.get<string>('JWT_SIGN_SECRET'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 3,
      secret: this.configService.get<string>('JWT_SIGN_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(token: string, userId: number) {
    await this.tokenRepo.upsert(
      {
        token: token,
        userId: userId,
        created_at: new Date(),
        updated_at: new Date(),
        isDelete: false,
      },
      ['userId'],
    );
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
