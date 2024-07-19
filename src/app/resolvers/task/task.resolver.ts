import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TYPE_REQUEST } from 'src/app/common';
import {
  ActionTaskResponse,
  TaskFillterInput,
  UpsertTaskInput,
} from 'src/app/dtos';
import { GetTaskResponse } from 'src/app/dtos/task/getTaskResponse.dto';
import { Task, User } from 'src/app/entities';
import { TaskService, UserService } from 'src/app/services';

@Resolver((of) => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query((returns) => GetTaskResponse, { nullable: true, name: 'getAllTasks' })
  async getAll(
    @Args('fillter', { type: () => TaskFillterInput, nullable: true })
    fillterTaskDto: TaskFillterInput,
    @Args('userId', { type: () => Int, nullable: true }) userId: number,
  ): Promise<GetTaskResponse> {
    if (fillterTaskDto != null) {
      return await this.taskService.fillterTask(userId, fillterTaskDto);
    }
  }

  @ResolveField('user', (type) => User, { nullable: true })
  async getUser(@Parent() task: Task) {
    return task.user;
  }

  @Mutation((type) => ActionTaskResponse, {
    name: 'createTask',
  })
  async createTask(@Args('req') req: UpsertTaskInput) {
    return await this.taskService.upsert(TYPE_REQUEST.create, req);
  }

  @Mutation((type) => ActionTaskResponse, {
    name: 'updateTask',
  })
  async updateTask(@Args('req') req: UpsertTaskInput) {
    return await this.taskService.upsert(TYPE_REQUEST.update, req);
  }

  @Mutation((type) => ActionTaskResponse, {
    name: 'deleteTask',
  })
  async deleteTask(@Args('id', { type: () => Int }) id: number) {
    return await this.taskService.delete(id);
  }
}
