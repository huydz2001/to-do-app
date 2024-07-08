import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { STATUS } from 'src/app/common/constants';
import { CreateGroupRequest } from 'src/app/dtos';
import { Group } from 'src/app/entities';

@Injectable()
export class GroupFactory {
  convertCreateRequestInputToModel(group: CreateGroupRequest): Group {
    return {
      id: null,
      members: [],
      group_name: group.group_name,
      avatar: group.avatar,
      isDelete: false,
      created_at: null,
      created_by: null,
      updated_at: null,
      updated_by: null,
    };
  }
}
