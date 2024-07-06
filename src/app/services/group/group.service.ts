import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddAndRemoveUserResponse,
  CreateGroupRequest,
  CreateGroupResponse,
} from 'src/app/dtos';
import { GroupFactory } from 'src/app/factories';
import { Group, User } from 'src/app/models';
import { ConfigData } from 'src/app/shared';
import { In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { STATUS } from 'src/app/common';
import { AddAndRemoveUserInput } from 'src/app/dtos/group/addAndRemoveInput.dto';
import { DeleteGroupResponse } from 'src/app/dtos/group/deleteResponse.dto';
import { RequestService } from 'src/app/shared/service/request.service';

@Injectable()
export class GroupService {
  public userLogin = 16;
  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
    private readonly groupFactory: GroupFactory,
    private readonly configData: ConfigData,
  ) {}

  async create(req: CreateGroupRequest): Promise<CreateGroupResponse> {
    const { members, ...groupInfor } = req;
    const listUser = await this.userRepo.findBy({ id: In(members) });
    let flag = true;
    const error = [];

    // check groupName
    const existGroup = await this.groupRepo.findOneBy({
      group_name: groupInfor.group_name,
    });
    if (existGroup) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Create group fail',
        errors: [
          {
            field: 'group_name',
            message: 'Group name already exist',
          },
        ],
        group: null,
      };
    }

    // check user joined an other group
    listUser.forEach((item) => {
      if (item.status != STATUS.NOT_JOIN) {
        flag = false;
        error.push({
          field: 'members',
          message: `member ${item.id} already joined an other group`,
        });
      }
    });

    // continue if don't have any error
    if (flag) {
      const group = this.groupFactory.convertCreateRequestInputToModel(req);
      // get infor user from login
      this.configData.createdData(this.userLogin, group);
      group.members = listUser;

      await this.groupRepo.save(group);
      listUser.forEach(async (item) => {
        if (item.id == group.created_by) {
          item.status = STATUS.CREATE;
        } else item.status = STATUS.JOINED;
        item = this.configData.updatedData(this.userLogin, item);
        await this.userRepo.update(item.id, item);
      });

      const { id, group_name, ...groupData } = group;

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Create group success',
        errors: null,
        group: {
          id: id,
          group_name: group_name,
        },
      };
    }

    return {
      code: HttpStatus.BAD_REQUEST,
      success: false,
      message: 'Create group fail',
      errors: error,
      group: null,
    };
  }

  async getAll() {
    return await this.groupRepo.find({
      where: {
        isDelete: false,
      },
      relations: {
        members: true,
      },
    });
  }

  async findByIds(ids: number[]) {
    return await this.groupRepo.findBy({
      id: In(ids),
    });
  }

  async findByUserId(id: number) {
    return await this.groupRepo.findOne({
      where: {
        members: {
          id: id,
        },
      },
      relations: {
        members: true,
      },
    });
  }

  async findById(id: number) {
    return await this.groupRepo.findOneBy({ id: id });
  }

  async addUser(req: AddAndRemoveUserInput): Promise<AddAndRemoveUserResponse> {
    const { groupId, userId } = req;
    let existGroup = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: {
        members: true,
      },
    });

    // check exist group
    if (!existGroup) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Group not found',
        errors: [
          {
            field: 'id',
            message: 'GroupId not exist',
          },
        ],
        groupId: null,
        user: null,
      };
    }

    // check exist user and joined group
    let existUser = await this.userRepo.findOneBy({ id: userId });
    if (!existUser) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'User not found',
        errors: [
          {
            field: 'userId',
            message: 'userId not exist',
          },
        ],
        groupId: null,
        user: null,
      };
    } else if (existUser.status != STATUS.NOT_JOIN) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'User already joined an orther group',
        errors: [
          {
            field: 'userId',
            message: 'user already joined an other group',
          },
        ],
        groupId: null,
        user: null,
      };
    }

    existGroup.members.push(existUser);
    existGroup = this.configData.updatedData(this.userLogin, existGroup);

    existUser.status = STATUS.JOINED;
    existUser.group = existGroup;
    existUser = this.configData.updatedData(this.userLogin, existUser);

    try {
      await this.groupRepo.save(existGroup);
      await this.userRepo.save(existUser);
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Add member to group success',
        errors: null,
        groupId: groupId,
        user: {
          id: userId,
          user_name: existUser.user_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async removeUser(
    req: AddAndRemoveUserInput,
  ): Promise<AddAndRemoveUserResponse> {
    const { groupId, userId } = req;

    try {
      let existGroup = await this.groupRepo.findOne({
        where: { id: groupId },
        relations: {
          members: true,
        },
      });

      // check exist group
      if (!existGroup) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Group not found',
          errors: [
            {
              field: 'id',
              message: 'GroupId not exist',
            },
          ],
          groupId: null,
          user: null,
        };
      }

      // check exist user
      let existUser = await this.userRepo.findOneBy({ id: userId });
      if (!existUser) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'User not found',
          errors: [
            {
              field: 'userId',
              message: 'userId not exist',
            },
          ],
          groupId: null,
          user: null,
        };
      }

      // check exist member in group
      if (!existGroup.members.filter((x) => x.id == userId)) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'User not in group',
          errors: [
            {
              field: 'userId',
              message: 'UserId wrong',
            },
          ],
          groupId: null,
          user: null,
        };
      }

      existGroup.members = existGroup.members.filter(
        (member) => member.id !== userId,
      );
      existGroup = this.configData.updatedData(this.userLogin, existGroup);

      existUser.group = null;
      existUser.status = STATUS.NOT_JOIN;
      existUser = this.configData.updatedData(this.userLogin, existUser);

      Promise.all([
        await this.userRepo.save(existUser),
        await this.groupRepo.save(existGroup),
      ]);

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'User not found',
        errors: null,
        groupId: groupId,
        user: {
          id: userId,
          user_name: existUser.user_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<DeleteGroupResponse> {
    try {
      let existGroup = await this.groupRepo.findOne({
        where: { id: id },
        relations: { members: true },
      });
      if (!existGroup) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Group not found',
          errors: [
            {
              field: 'id',
              message: 'id wrong',
            },
          ],
          group: null,
        };
      }

      existGroup = this.configData.deleteData(this.userLogin, existGroup);

      const listUser = existGroup.members.map((item) => {
        item.group = null;
        item.status = STATUS.NOT_JOIN;
        item = this.configData.deleteData(this.userLogin, item);
        return item;
      });

      Promise.all([
        await this.userRepo.save(listUser),
        await this.groupRepo.save(existGroup),
      ]);

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Delete Group Success',
        errors: null,
        group: {
          id: id,
          group_name: existGroup.group_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
