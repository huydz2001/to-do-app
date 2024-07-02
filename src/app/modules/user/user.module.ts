import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { User } from 'src/app/models';
import { UserResolver } from 'src/app/resolvers';
import { AuthService, UserService } from 'src/app/services';
import { RequestService } from 'src/app/shared';
import { ConfigData } from 'src/app/shared/db/configData.db';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserResolver,
    UserService,
    UserFactory,
    ConfigData,
    RequestService,
    AuthService,
  ],
})
export class UserModule {}
