import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFactory } from 'src/app/factories';
import { Group, Task, User } from 'src/app/models';
import { UserResolver } from 'src/app/resolvers';
import { AuthService, UserService } from 'src/app/services';
import { RequestService } from 'src/app/shared';
import { ConfigData } from 'src/app/shared/db/configData.db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([User, Task, Group]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    UserResolver,
    UserService,
    UserFactory,
    ConfigData,
    RequestService,
    AuthService,
  ],
  exports: [],
})
export class UserModule {}
