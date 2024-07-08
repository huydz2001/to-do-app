import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateDataInput, LoginDataInput } from 'src/app/dtos';
import { LoginResponse } from 'src/app/dtos/user/loginResponse.dto';
import { Group, User } from 'src/app/entities';
import { GroupService, UserService } from 'src/app/services';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @Query((returns) => [User], { nullable: true, name: 'getAllUsers' })
  async getAll(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @ResolveField('group', (type) => [Group], { nullable: true })
  async getGroups(@Parent() user: User) {
    return this.groupService.getAll();
  }
}
