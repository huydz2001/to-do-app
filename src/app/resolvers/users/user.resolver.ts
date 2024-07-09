import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  ChangePassInput,
  ChangePassResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
} from 'src/app/dtos';
import { Group, Task, User } from 'src/app/entities';
import { GroupService, TaskService, UserService } from 'src/app/services';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly taskService: TaskService,
  ) {}

  @Query((returns) => [User], { nullable: true, name: 'getAllUsers' })
  async getAll(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @ResolveField('group', (type) => Group, { nullable: true })
  async getGroups(@Parent() user: User) {
    return user.group;
  }

  @ResolveField('tasks', (type) => [Task], { nullable: true })
  async getTasks(@Parent() user: User) {
    return user.tasks;
  }

  @Mutation((type) => ChangePassResponse, { name: 'changePassword' })
  async changePass(
    @Args('req') req: ChangePassInput,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.userService.changePass(id, req);
  }

  @Mutation((type) => UpdateProfileResponse, { name: 'updateProfile' })
  async updateProfile(
    @Args('req') req: UpdateProfileInput,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.userService.updateProfile(id, req);
  }
}
