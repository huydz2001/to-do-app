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
import { ActionTaskResponse, UpsertTaskInput } from 'src/app/dtos';
import { Task, User } from 'src/app/entities';
import { TaskService, UserService } from 'src/app/services';

@Resolver((of) => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query((returns) => [Task], { nullable: true, name: 'getAllTasks' })
  async getAll(): Promise<Task[]> {
    return await this.taskService.getAll();
  }

  @Query((returns) => [Task], { nullable: true })
  async getAllTaskByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Task[]> {
    return await this.taskService.getTasksByUser(userId);
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
