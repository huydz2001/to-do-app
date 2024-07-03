import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { Group, Task, User } from 'src/app/models';
import { UserResolver } from 'src/app/resolvers';
import { UserService } from 'src/app/services';
import { ConfigData } from 'src/app/shared/db/configData.db';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Group])],
  providers: [UserResolver, UserFactory, UserService, ConfigData],
  exports: [],
})
export class UserModule {}
