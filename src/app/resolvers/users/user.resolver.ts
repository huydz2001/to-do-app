import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDataInput, LoginDataInput } from 'src/app/dtos';
import { User } from 'src/app/models';
import { UserService } from 'src/app/services';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User, { nullable: true })
  async getUserById(@Args('id', { type: () => Number }) id: string) {
    return {
      id: 1,
      user_name: 'huy',
    };
  }

  @Query((returns) => User, { nullable: true })
  async login(@Args('req') req: LoginDataInput) {
    const user = this.userService.login(req);
  }

  @Mutation((returns) => User)
  async createUser(@Args('req') request: CreateDataInput) {
    return this.userService.crateUser(request);
  }
}
