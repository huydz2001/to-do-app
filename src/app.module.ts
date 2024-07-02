import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GroupModule, TaskModule, UserModule } from './app/modules';
import { DatabaseModule } from './app/shared';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    DatabaseModule,
    TaskModule,
    GroupModule,
    UserModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
