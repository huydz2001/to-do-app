import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskFactory, UserFactory } from 'src/app/factories';
import { Task, User } from 'src/app/entities';
import { TaskResolver } from 'src/app/resolvers';
import { TaskService, UserService } from 'src/app/services';
import { ConfigData, RequestModule, RequestService } from 'src/app/shared';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task]), RequestModule],
  providers: [
    TaskResolver,
    TaskService,
    UserService,
    UserFactory,
    RequestService,
    ConfigData,
    TaskFactory,
  ],
  exports: [TaskService, TaskFactory],
})
export class TaskModule {}
