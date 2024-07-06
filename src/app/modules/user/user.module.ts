import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupFactory, UserFactory } from 'src/app/factories';
import { Group, Task, User } from 'src/app/models';
import { UserResolver } from 'src/app/resolvers';
import { GroupService, UserService } from 'src/app/services';
import { ConfigData } from 'src/app/shared/db/configData.db';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Group])],
  providers: [
    UserResolver,
    UserFactory,
    UserService,
    ConfigData,
    GroupService,
    GroupFactory,
  ],
  exports: [],
})
export class UserModule {}
