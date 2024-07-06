import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupFactory, UserFactory } from 'src/app/factories';
import { Group, User } from 'src/app/models';
import { GroupResolver } from 'src/app/resolvers';
import { GroupService, UserService } from 'src/app/services';
import { ConfigData } from 'src/app/shared';
import { RequestService } from 'src/app/shared/service/request.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  providers: [
    GroupResolver,
    GroupService,
    GroupFactory,
    ConfigData,
    UserService,
    UserFactory,
  ],
})
export class GroupModule {}
