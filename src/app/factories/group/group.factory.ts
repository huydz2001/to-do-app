import { Injectable } from '@nestjs/common';
import { UpsertGroupRequest } from 'src/app/dtos';
import { Group } from 'src/app/entities';

@Injectable()
export class GroupFactory {
  convertUpsertRequestInputToModel(group: UpsertGroupRequest): Group {
    return {
      id: group.id ? group.id : null,
      members: [],
      group_name: group.group_name,
      avatar: group.avatar,
      isDelete: false,
      created_at: null,
      updated_at: null,
    };
  }
}
