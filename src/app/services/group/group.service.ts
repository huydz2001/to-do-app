import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { STATUS, TYPE_REQUEST } from 'src/app/common';
import {
  AddAndRemoveUserInput,
  AddAndRemoveUserResponse,
  DeleteGroupResponse,
  UpsertGroupRequest,
  UpsertGroupResponse,
} from 'src/app/dtos';
import { Group, User } from 'src/app/entities';
import { GroupFactory } from 'src/app/factories';
import { ConfigData } from 'src/app/shared';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class GroupService {
  public userLogin = 18;
  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly groupFactory: GroupFactory,
    private readonly configData: ConfigData,
  ) {}

  async upsert(
    type: string,
    req: UpsertGroupRequest,
  ): Promise<UpsertGroupResponse> {
    const { members, ...groupInfor } = req;
    let flag = true;
    const error = [];

    const oldIds = [];
    let idsResult = [];
    let idsReject = [];
    let listUser: User[];
    let listUserReject: User[];

    // [18, 19]  [19, 20]  => [19, 20]
    // b1:  tim tat ca thang trung
    // b2: lay tat ca cac thang khac trong mang moi truyen vao
    // result: reject = [18], result = [19,20]

    // get all member of group
    if (groupInfor.id) {
      const existGroup = await this.groupRepo.findOne({
        where: { id: groupInfor.id },
        relations: { members: true },
      });
      existGroup.members.forEach((item) => {
        oldIds.push(item.id);
      });

      const idsBetween = this.findCommonElements(members, oldIds);

      idsReject = oldIds.filter((id) => !idsBetween.includes(id));
      idsResult = [
        ...idsBetween,
        ...members.filter((id) => !idsBetween.includes(id)),
      ];

      listUser = await this.userRepo.findBy({ id: In(idsResult) });
      listUserReject = await this.userRepo.findBy({ id: In(idsReject) });
    } else {
      listUser = await this.userRepo.findBy({ id: In(members) });
    }

    // check groupName
    let existGroup: Group;
    if (groupInfor.id) {
      existGroup = await this.groupRepo.findOne({
        where: {
          group_name: groupInfor.group_name,
          id: Not(In(Array.of(Number(groupInfor.id)))),
        },
      });
    } else {
      existGroup = await this.groupRepo.findOne({
        where: {
          group_name: groupInfor.group_name,
        },
      });
    }

    if (existGroup) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: `${type} group failed`,
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
      if (item.status != STATUS.NOT_JOIN && !oldIds.includes(item.id)) {
        flag = false;
        error.push({
          field: 'members',
          message: `member ${item.id} already joined an other group`,
        });
        return;
      }
    });

    // continue if don't have any error
    if (flag) {
      let group = this.groupFactory.convertUpsertRequestInputToModel(req);
      group.members = listUser;
      if (type == TYPE_REQUEST.create) {
        group = this.configData.createdData(group);
      } else {
        group = this.configData.updatedData(group);
      }

      // update status user who are inserted into group
      listUser.map((item) => {
        if (item.id == req.create_by) {
          item.status = STATUS.CREATE;
        } else item.status = STATUS.JOINED;
        item = this.configData.updatedData(item);
        return item;
      });

      // Update users who are disqualified from the group
      if (listUserReject) {
        listUserReject.map((item) => {
          item.status = STATUS.NOT_JOIN;
          item = this.configData.updatedData(item);
          return item;
        });
        Promise.all([
          await this.userRepo.save(listUser),
          await this.userRepo.save(listUserReject),
          await this.groupRepo.save(group),
        ]);
      } else {
        Promise.all([
          await this.userRepo.save(listUser),
          await this.groupRepo.save(group),
        ]);
      }

      return {
        code: HttpStatus.OK,
        success: true,
        message: `${type} group success`,
        errors: [],
        group: {
          id: group.id,
          group_name: group.group_name,
        },
      };
    }

    return {
      code: HttpStatus.BAD_REQUEST,
      success: false,
      message: `${type} group failed`,
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

  async getByUser(userId: number): Promise<Group> {
    const existGroup = await this.groupRepo.findOne({
      where: {
        isDelete: false,
        members: {
          id: userId,
        },
      },
      relations: {
        members: true,
      },
    });

    const members = await this.groupRepo
      .findOne({
        where: {
          id: existGroup.id,
        },
        relations: {
          members: true,
        },
      })
      .then((result) => {
        return result.members;
      });

    existGroup.members = members;

    return existGroup;
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
    const { groupId, userName } = req;
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

      // check exist user and joined group
      let existUser = await this.userRepo.findOneBy({ name: userName });
      if (!existUser) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'User not found',
          errors: [
            {
              field: 'user name',
              message: 'user name not exist',
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
      existGroup = this.configData.updatedData(existGroup);

      existUser.status = STATUS.JOINED;
      existUser.group = existGroup;
      existUser = this.configData.updatedData(existUser);

      await this.groupRepo.save(existGroup);
      await this.userRepo.save(existUser);
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Add member to group success',
        errors: [],
        groupId: groupId,
        user: {
          id: existUser.id,
          user_name: existUser.name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async removeUser(
    req: AddAndRemoveUserInput,
  ): Promise<AddAndRemoveUserResponse> {
    const { groupId, userName } = req;

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
      let existUser = await this.userRepo.findOneBy({ name: userName });
      if (!existUser) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'User not found',
          errors: [
            {
              field: 'user name',
              message: 'user name not exist',
            },
          ],
          groupId: null,
          user: null,
        };
      }

      // check exist member in group
      if (!existGroup.members.filter((x) => x.name == userName)) {
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
        (member) => member.name !== userName,
      );
      existGroup = this.configData.updatedData(existGroup);

      existUser.group = null;
      existUser.status = STATUS.NOT_JOIN;
      existUser = this.configData.updatedData(existUser);

      Promise.all([
        await this.userRepo.save(existUser),
        await this.groupRepo.save(existGroup),
      ]);

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Remove user success',
        errors: [],
        groupId: groupId,
        user: {
          id: existUser.id,
          user_name: existUser.name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<DeleteGroupResponse> {
    try {
      const existGroup = await this.groupRepo.findOne({
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

      const listUser = existGroup.members.map((item) => {
        item.group = null;
        item.status = STATUS.NOT_JOIN;
        item = this.configData.updatedData(item);
        return item;
      });

      Promise.all([
        await this.userRepo.save(listUser),
        await this.groupRepo.delete({ id: id }),
      ]);

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Delete Group Success',
        errors: [],
        group: {
          id: id,
          group_name: existGroup.group_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateAvatar(id: number, url: string) {
    let existGroup = await this.groupRepo.findOneBy({ id: id });
    existGroup.avatar = url;
    existGroup = this.configData.updatedData(existGroup);
    return await this.groupRepo.save(existGroup);
  }

  private findCommonElements(array1, array2) {
    const commonElements = [];

    for (const element1 of array1) {
      if (array2.includes(element1)) {
        commonElements.push(element1);
      }
    }

    return commonElements;
  }
}
