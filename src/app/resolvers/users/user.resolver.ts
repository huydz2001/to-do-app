import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDataInput } from 'src/app/dtos';
import { UserFactory } from 'src/app/factories';
import { User } from 'src/app/models';
import { UserService } from 'src/app/services';
import { ConfigData } from 'src/app/shared/db/configData.db';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userFactory: UserFactory,
    private readonly configData: ConfigData,
  ) {}

  @Query((returns) => User, { nullable: true })
  async getUserById(@Args('id', { type: () => Number }) id: string) {
    return {
      id: 1,
      user_name: 'huy',
    };
  }

  @Mutation((returns) => User)
  async createUser(@Args('createData') request: CreateDataInput) {
    let user = await this.userFactory.convertCreateRequestInputToModel(request);
    user = this.configData.createdData(user);
    console.log('user::', user);
    return this.userService.crateUser(user);
  }
}
