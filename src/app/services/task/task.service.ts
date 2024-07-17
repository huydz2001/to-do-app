import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { TYPE_REQUEST } from 'src/app/common';
import {
  ActionTaskResponse,
  TaskFillterInput,
  UpsertTaskInput,
} from 'src/app/dtos';
import { GetTaskResponse } from 'src/app/dtos/task/getTaskResponse.dto';
import { Task, User } from 'src/app/entities';
import { TaskFactory } from 'src/app/factories';
import { ConfigData } from 'src/app/shared';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly taskFactory: TaskFactory,
    private readonly configData: ConfigData,
  ) {}

  async fillterTask(
    userId: number,
    taskFiltter: TaskFillterInput,
  ): Promise<GetTaskResponse> {
    let skipNumber = 0;
    let takeRecord = 10;
    let timeResult;
    const { time, status, search, pagination, date, sort } = taskFiltter;

    if (time) {
      const timeArr = time.split(':');
      const hour = Number(timeArr[0]);
      const minute = Number(timeArr[1]);
      timeResult = dayjs(date).hour(hour).minute(minute).format();
    }

    if (pagination) {
      const { page, limit } = pagination;
      skipNumber = (page - 1) * limit;
      takeRecord = limit;
    }

    const conditions: FindOptionsWhere<Task> | FindOptionsWhere<Task>[] = {
      ...(status ? { status } : {}),
      ...(search ? { name: Like(`%${search}%`) } : {}),
      ...(date
        ? { start_date: Raw((alias) => `${alias.toString()} = '${date}'`) }
        : {}),
      ...(time
        ? {
            start_time: LessThanOrEqual(timeResult),
            end_time: MoreThanOrEqual(timeResult),
          }
        : {}),
      ...(userId ? { user: { id: userId } } : {}),
    };

    const orders: FindOptionsOrder<Task> = sort?.field
      ? {
          [`${sort.field}`]: `${sort.direction}`,
        }
      : {};

    const [tasks, total] = await this.taskRepo.findAndCount({
      where: conditions,
      skip: skipNumber,
      take: takeRecord,
      order: orders,
    });

    const lastPage = Math.ceil(total / pagination.limit);
    const nextPage =
      pagination.page + 1 > lastPage ? null : pagination.page + 1;
    const prevPage = pagination.page - 1 < 1 ? null : pagination.page - 1;

    console.log(tasks);

    return {
      code: HttpStatus.OK,
      success: true,
      message: 'Find tasks success',
      errors: [],
      tasks: tasks,
      total: total,
      currentPage: pagination.page,
      lastPage: lastPage,
      prevPage: prevPage,
      nextPage: nextPage,
    };
  }

  async upsert(
    type: string,
    req: UpsertTaskInput,
  ): Promise<ActionTaskResponse> {
    try {
      let flag = true;
      // check start_time, end_time
      if (req.start_time > req.end_time) {
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
        console.log(flag);
      }

      if (!flag) {
        return {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: `${type} task failed`,
          errors: [
            {
              field: 'start_time, end_time',
              message: `User has an task from ${req.start_time.toLocaleString('vn-VN', { timeStyle: 'medium', hour12: false })} to ${req.end_time.toLocaleString('vn-VN', { timeStyle: 'medium', hour12: false })}`,
            },
          ],
          task: null,
        };
      }

      let task = this.taskFactory.convertUpsertTaskInputToModel(req);
      task.user = existUser;

      if (type == TYPE_REQUEST.create) {
        task = this.configData.createdData(task);
      } else {
        const existTask = await this.taskRepo.findOneBy({ id: req.id });
        task.created_at = existTask.created_at;
        task = this.configData.updatedData(task);
      }

      await this.taskRepo.save(task);

      return {
        code: HttpStatus.OK,
        success: true,
        message: `${type} task success`,
        errors: [],
        task: {
          id: task.id,
          name: task.name,
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
          name: existTask.name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private checkValidateTime(
    listTask: Task[],
    startTime: Date,
    endTime: Date,
  ): boolean {
    let flag = true;
    listTask.forEach((item) => {
      if (
        (startTime <= item.end_time && endTime >= item.end_time) ||
        (startTime <= item.start_time && endTime >= item.start_time) ||
        (startTime.getTime() === item.start_time.getTime() &&
          endTime.getTime() === item.end_time.getTime())
      ) {
        flag = false;
        return;
      }
    });
    return flag;
  }
}
