import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeyMiddleware, AuthencationMiddleware } from './app/common';
import { AuthModule, GroupModule, TaskModule, UserModule } from './app/modules';
import { DatabaseModule } from './app/shared';

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
      signOptions: { expiresIn: '24h' },
    }),
    DatabaseModule,
    TaskModule,
    GroupModule,
    UserModule,
    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware, AuthencationMiddleware).forRoutes('*');
  }
}
