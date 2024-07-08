import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { Group, Task, Token, User } from 'src/app/entities';
import { AuthResolver } from 'src/app/resolvers';
import { AuthService } from 'src/app/services';
import { ConfigData, RequestModule, RequestService } from 'src/app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task, Group, Token]),
    RequestModule,
  ],
  providers: [
    AuthService,
    UserFactory,
    ConfigData,
    AuthResolver,
    RequestService,
  ],
})
export class AuthModule {}
