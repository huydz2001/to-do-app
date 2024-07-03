import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { Group, Task, User } from 'src/app/models';
import { AuthResolver } from 'src/app/resolvers';
import { AuthService } from 'src/app/services';
import { ConfigData } from 'src/app/shared';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Group])],
  providers: [AuthService, UserFactory, ConfigData, AuthResolver],
})
export class AuthModule {}
