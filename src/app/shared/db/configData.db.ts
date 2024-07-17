import { Injectable } from '@nestjs/common';
import { BaseModel } from '../model/base.model';

@Injectable()
export class ConfigData {
  constructor() {}

  createdData<T extends BaseModel>(entity: T, dateTime?: Date) {
    entity.isDelete = false;
    entity.created_at = dateTime ? dateTime : new Date();
    entity.updated_at = dateTime ? dateTime : new Date();
    return entity;
  }

  updatedData<T extends BaseModel>(entity: T, dateTime?: Date) {
    entity.updated_at = dateTime ? dateTime : new Date();
    return entity;
  }
}
