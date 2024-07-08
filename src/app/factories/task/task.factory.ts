import { Injectable } from '@nestjs/common';
import { STATUS_TASK } from 'src/app/common';
import { UpsertTaskInput } from 'src/app/dtos';
import { Task } from 'src/app/entities';

@Injectable()
export class TaskFactory {
  convertUpsertTaskInputToModel(task: UpsertTaskInput): Task {
    return {
      id: task.id ? task.id : null,
      task_name: task.task_name,
      start_date: task.start_date,
      start_time: task.start_time,
      end_time: task.end_time,
      status: task.status ? task.status : STATUS_TASK.NOT_STARTED,
      desc: task.desc ? task.desc : null,
      user: null,
      isDelete: false,
      created_at: null,
      created_by: null,
      updated_at: null,
      updated_by: null,
    };
  }
}
