import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeyMiddleware, AuthencationMiddleware } from './app/common';
import { AuthModule, GroupModule, TaskModule, UserModule } from './app/modules';
import { ConfigData, DatabaseModule, RequestModule } from './app/shared';
import { RequestService } from './app/shared/service/request.service';
import { UserFactory } from './app/factories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, User } from './app/entities';
import { AuthService } from './app/services';

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
  ],
  controllers: [],
  providers: [RequestService, AuthService, UserFactory, ConfigData],
  exports: [RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware, AuthencationMiddleware).forRoutes('*');
  }
}
