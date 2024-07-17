import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { User, Group } from 'src/app/entities';
import { ConfigData, RequestService } from 'src/app/shared';
import { In, Repository } from 'typeorm';
import {
  ChangePassInput,
  ChangePassResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
} from 'src/app/dtos';
import * as brcypt from 'bcrypt';
import { STATUS } from 'src/app/common';

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

  async getUsers() {
    return await this.userRepo.find({
      relations: {
        group: true,
        tasks: true,
      },
    });
  }

  async findById(id: number) {
    return await this.userRepo.findOneBy({ id: id });
  }

  async findByIds(ids: number[]) {
    return await this.userRepo.findBy({ id: In(ids) });
  }

  async findUserAdmin(id: number) {
    return await this.userRepo.findOne({
      where: {
        id: id,
        status: STATUS.CREATE,
      },
    });
  }

  async updateAvatar(id: number, file: string) {
    return await this.userRepo.update({ id: id }, { avatar: file });
  }

  async changePass(
    id: number,
    req: ChangePassInput,
  ): Promise<ChangePassResponse> {
    let existUser = await this.userRepo.findOneBy({ id: id });

    if (!existUser) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Change password failed',
        errors: [
          {
            field: 'id',
            message: 'User not found',
          },
        ],
        id: null,
      };
    }

    const isComparePass = await brcypt.compareSync(
      req.oldPass,
      existUser.password,
    );

    if (!isComparePass) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Change password failed',
        errors: [
          {
            field: 'oldPass',
            message: 'Password not correct',
          },
        ],
        id: null,
      };
    }

    const newHashPass = await brcypt.hashSync(req.newPass, 10);
    existUser.password = newHashPass;

    existUser = this.configData.updatedData(existUser);

    await this.userRepo.save(existUser);

    return {
      code: HttpStatus.OK,
      success: true,
      message: 'Change password success',
      errors: [],
      id: id,
    };
  }

  async updateProfile(
    id: number,
    req: UpdateProfileInput,
  ): Promise<UpdateProfileResponse> {
    let existUser = await this.userRepo.findOneBy({ id: id });

    if (!existUser) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Update profile failed',
        errors: [
          {
            field: 'id',
            message: 'User not found',
          },
        ],
        id: null,
      };
    }

    const userFindUsername = await this.userRepo.findOneBy({
      name: req.name,
    });
    if (userFindUsername) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Update profile failed',
        errors: [
          {
            field: 'name',
            message: 'Username is already used by an other user',
          },
        ],
        id: id,
      };
    }

    existUser = this.configData.updatedData(existUser);
    existUser.avatar = req.avatar;
    existUser.dob = req.dob;
    existUser.name = req.name;

    await this.userRepo.save(existUser);

    return {
      code: HttpStatus.OK,
      success: true,
      message: 'Update profile success',
      errors: [],
      id: id,
    };
  }
}
