import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDataInput, LoginDataInput } from 'src/app/dtos';
import { LoginResponse } from 'src/app/dtos/user/loginResponse.dto';
import { User } from 'src/app/models';
import { UserService } from 'src/app/services';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => [User], { nullable: true })
  async getUsers(@Context() ctx: any) {
    console.log(ctx.req.user);
    return this.userService.getUsers();
  }
}
