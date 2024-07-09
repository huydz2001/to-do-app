import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupFactory, UserFactory } from 'src/app/factories';
import { Group, Task, Token, User } from 'src/app/entities';
import { UserResolver } from 'src/app/resolvers';
import { GroupService, UserService } from 'src/app/services';
import { RequestModule, RequestService } from 'src/app/shared';
import { ConfigData } from 'src/app/shared/db/configData.db';
import { TaskModule } from '../task/task.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task, Group, Token]),
    RequestModule,
    TaskModule,
    GroupModule,
  ],
  providers: [
    UserResolver,
    UserFactory,
    UserService,
    ConfigData,
    RequestService,
  ],
  exports: [UserFactory, UserService],
})
export class UserModule {}
