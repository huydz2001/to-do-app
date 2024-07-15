import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ADMIN_ID, SORT_DIRECTION, TYPE_REQUEST } from 'src/app/common';
import {
  ActionTaskResponse,
  TaskFillterInput,
  UpsertTaskInput,
} from 'src/app/dtos';
import { GetTaskResponse } from 'src/app/dtos/task/getTaskResponse.dto';
import { Task, User } from 'src/app/entities';
import { TaskFactory } from 'src/app/factories';
import { ConfigData } from 'src/app/shared';
import { In, Raw, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly taskFactory: TaskFactory,
    private readonly configData: ConfigData,
  ) {}

  public userLogin = ADMIN_ID;

  async getAll(userId: number): Promise<GetTaskResponse> {
    const tasks = await this.taskRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    console.log(tasks);

    return {
      code: HttpStatus.OK,
      success: true,
      message: 'Find tasks success',
      errors: [],
      tasks: tasks,
    };
  }

  async fillterTask(
    userId: number,
    taskFiltter: TaskFillterInput,
  ): Promise<GetTaskResponse> {
    const { time, status, search, pagination, date, sort } = taskFiltter;
    let tasks = (await this.getAll(userId)).tasks;
    if (time) {
      const timeRq = this.convertStringToMinute(time);
      tasks = tasks.filter(
        (item) =>
          this.convertStringToMinute(item.start_time) <= timeRq &&
          timeRq <= this.convertStringToMinute(item.end_time),
      );
    }

    if (search) {
      tasks = tasks.filter((item) => item.task_name.includes(search));
    }

    if (status) {
      tasks = tasks.filter((item) => item.status == status);
    }

    if (pagination) {
      const { page = 1, limit = 10 } = pagination;
      const startIndex = (page - 1) * limit;
      const lastIndex = startIndex + limit;
      tasks = tasks.slice(startIndex, lastIndex);
    }

    if (date) {
      tasks = tasks.filter((item) => item.start_date.toString() == date);
    }

    if (sort) {
      const { field, direction } = sort;
      tasks = tasks.sort((a, b) => {
        let aValue = a[field] as string;
        let bValue = b[field] as string;
        if (field == 'start_time' || field == 'end_time') {
          aValue = this.convertStringToMinute(a[field]).toString();
          bValue = this.convertStringToMinute(b[field]).toString();
        }

        if (aValue < bValue) return direction === SORT_DIRECTION.ASC ? -1 : 1;
        if (aValue > bValue) return direction === SORT_DIRECTION.ASC ? 1 : -1;
        return 0;
      });
    }

    tasks.map((item) => {
      item.user = null;
      return item;
    });

    return {
      code: HttpStatus.OK,
      success: true,
      message: 'Find tasks success',
      errors: [],
      tasks: tasks,
    };
  }

  async upsert(
    type: string,
    req: UpsertTaskInput,
  ): Promise<ActionTaskResponse> {
    try {
      let flag = true;
      // check start_time, end_time
      const minuteStartTimeRq = this.convertStringToMinute(req.start_time);
      const minuteEndTimeRq = this.convertStringToMinute(req.end_time);

      if (minuteStartTimeRq > minuteEndTimeRq) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: `${type} task failed`,
          errors: [
            {
              field: 'start_time',
              message: 'Start time must be smaller than end time',
            },
          ],
          task: null,
        };
      }

      // check user exist
      const existUser = await this.userRepo.findOneBy({ id: req.userId });

      if (!existUser) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: `${type} task failed`,
          errors: [
            {
              field: 'userId',
              message: 'userId not exist',
            },
          ],
          task: null,
        };
      }

      // check user exist task in time
      const existTasks = await this.getTasksByUserAndDate(
        req.userId,
        req.start_date,
      );

      if (existTasks) {
        flag = this.checkValidateTime(existTasks, req.start_time, req.end_time);
      }

      if (!flag) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: `${type} task failed`,
          errors: [
            {
              field: 'start_time, end_time',
              message: `User has an task from ${req.start_time} to ${req.end_time}`,
            },
          ],
          task: null,
        };
      }

      let task = this.taskFactory.convertUpsertTaskInputToModel(req);
      task.user = existUser;

      if (type == TYPE_REQUEST.create) {
        task = this.configData.createdData(this.userLogin, task);
      } else {
        const existTask = await this.taskRepo.findOneBy({ id: req.id });
        task.created_at = existTask.created_at;
        task.created_by = existTask.created_by;
        task = this.configData.updatedData(this.userLogin, task);
      }

      await this.taskRepo.save(task);

      return {
        code: HttpStatus.OK,
        success: true,
        message: `${type} task success`,
        errors: [],
        task: {
          id: task.id,
          task_name: task.task_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getTasksByUserAndDate(userId: number, date: string): Promise<Task[]> {
    return await this.taskRepo.find({
      where: {
        user: {
          id: userId,
        },
        start_date: Raw((alias) => `${alias.toString()} = '${date}'`),
      },
      relations: { user: true },
    });
  }

  async delete(id: number): Promise<ActionTaskResponse> {
    try {
      const existTask = await this.taskRepo.findOne({
        where: { id: id },
        relations: { user: true },
      });
      if (!existTask) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Delete task failed',
          errors: [
            {
              field: 'id',
              message: 'Task not found',
            },
          ],
          task: null,
        };
      }

      const user = await this.userRepo.findOne({
        where: {
          id: existTask.user.id,
        },
        relations: {
          tasks: true,
        },
      });

      user.tasks = user.tasks.filter((item) => item.id != id);

      Promise.all([
        await this.userRepo.save(user),
        await this.taskRepo.delete({ id: id }),
      ]);

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Delete task success',
        errors: [],
        task: {
          id: id,
          task_name: existTask.task_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private convertStringToMinute(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  }

  private checkValidateTime(listTask: Task[], startTime, endTime): boolean {
    let flag = true;
    const minuteStartTimeRq = this.convertStringToMinute(startTime);
    const minuteEndTimeRq = this.convertStringToMinute(endTime);
    listTask.forEach((item) => {
      const minuteStartTime = this.convertStringToMinute(item.start_time);
      const minuteEndTime = this.convertStringToMinute(item.end_time);
      if (
        (minuteStartTimeRq < minuteEndTime &&
          minuteEndTimeRq > minuteEndTime) ||
        (minuteStartTimeRq < minuteStartTime &&
          minuteEndTimeRq > minuteStartTime) ||
        (minuteStartTimeRq == minuteStartTime &&
          minuteEndTimeRq == minuteEndTime)
      ) {
        flag = false;
        return;
      }
    });
    return flag;
  }
}
