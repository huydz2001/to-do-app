import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GroupModule, TaskModule, UserModule } from './app/modules';
import { DatabaseModule, RequestService } from './app/shared';
import { ConfigService } from '@nestjs/config';
import { ConfigData } from './app/shared/db/configData.db';

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
  providers: [ConfigService],
})
export class AppModule {}
