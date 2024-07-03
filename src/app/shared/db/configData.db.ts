import { Injectable } from '@nestjs/common';
import { BaseModel } from '../model/base.model';

@Injectable()
export class ConfigData {
  constructor() {}

  createdData<T extends BaseModel>(userId: number, entity: T, dateTime?: Date) {
    entity.isDelete = false;
    entity.created_at = dateTime ? dateTime : new Date();
    entity.created_by = userId;
    entity.updated_at = dateTime ? dateTime : new Date();
    entity.updated_by = userId;
    return entity;
  }

  updatedData<T extends BaseModel>(userId: number, entity: T, dateTime?: Date) {
    entity.updated_at = dateTime ? dateTime : new Date();
    entity.updated_by = userId;
    return entity;
  }

  deleteData<T extends BaseModel>(userId: number, entity: T, dateTime?: Date) {
    entity.isDelete = !entity.isDelete;
    entity.updated_at = dateTime ? dateTime : new Date();
    entity.updated_by = userId;
    return entity;
  }
}
