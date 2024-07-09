import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyMiddleware, AuthencationMiddleware } from './app/common';
import { UploadController } from './app/controller';
import { Token, User } from './app/entities';
import { UserFactory } from './app/factories';
import { AuthModule, GroupModule, TaskModule, UserModule } from './app/modules';
import { AuthService, GroupService, UserService } from './app/services';
import {
  CloudinaryModule,
  CloudinaryProvider,
  ConfigData,
  DatabaseModule,
  RequestModule,
  UploadService,
} from './app/shared';
import { RequestService } from './app/shared/service/request.service';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: memoryStorage(),
        dest: configService.get<string>('MULTER_DEST'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Token, User]),
    DatabaseModule,
    TaskModule,
    GroupModule,
    UserModule,
    AuthModule,
    RequestModule,
    CloudinaryModule,
  ],
  controllers: [UploadController],
  providers: [RequestService, AuthService, UserFactory, ConfigData],
  exports: [RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware, AuthencationMiddleware).forRoutes('*');
  }
}
