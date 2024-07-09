import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupFactory, UserFactory } from 'src/app/factories';
import { Group, User } from 'src/app/entities';
import { GroupResolver } from 'src/app/resolvers';
import { GroupService, UserService } from 'src/app/services';
import { ConfigData, RequestModule } from 'src/app/shared';
import { RequestService } from 'src/app/shared/service/request.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User]), RequestModule],
  providers: [
    GroupResolver,
    GroupService,
    GroupFactory,
    ConfigData,
    UserService,
    UserFactory,
    RequestService,
  ],
  exports: [GroupFactory, GroupService],
})
export class GroupModule {}
