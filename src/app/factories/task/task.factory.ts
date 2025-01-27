import { Injectable } from '@nestjs/common';
import { STATUS_TASK } from 'src/app/common';
import { UpsertTaskInput } from 'src/app/dtos';
import { Task } from 'src/app/entities';

@Injectable()
export class TaskFactory {
  convertUpsertTaskInputToModel(task: UpsertTaskInput): Task {
    return {
      id: task.id ? task.id : null,
      name: task.name,
      start_date: task.start_date,
      start_time: task.start_time,
      end_time: task.end_time,
      status: task.status ? task.status : STATUS_TASK.NOT_STARTED,
      desc: task.desc ? task.desc : null,
      created_by: task.createBy,
      user: null,
      isDelete: false,
      created_at: null,
      updated_at: null,
    };
  }
}
