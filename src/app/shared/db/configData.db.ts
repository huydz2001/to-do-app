import { Injectable } from '@nestjs/common';
import { BaseModel } from '../model/base.model';
import { RequestService } from '../service/request.service';

@Injectable()
export class ConfigData {
  constructor(private readonly requestService: RequestService) {}

  userId = this.requestService.getUserId();

  createdData<T extends BaseModel>(entity: T, dateTime?: Date) {
    entity.isDelete = false;
    entity.created_at = dateTime ? dateTime : new Date();
    entity.created_by = this.userId;
    entity.updated_at = dateTime ? dateTime : new Date();
    entity.updated_by = this.userId;
    return entity;
  }

  updatedData<T extends BaseModel>(entity: T, dateTime?: Date) {
    entity.updated_at = dateTime ? dateTime : new Date();
    entity.updated_by = this.userId;
    return entity;
  }

  deleteData<T extends BaseModel>(entity: T, dateTime?: Date) {
    entity.isDelete = !entity.isDelete;
    entity.updated_at = dateTime ? dateTime : new Date();
    entity.updated_by = this.userId;
    return entity;
  }
}
