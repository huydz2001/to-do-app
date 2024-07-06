import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { RoleGroupAuth } from 'src/app/common';
import {
  AddAndRemoveUserResponse,
  CreateGroupRequest,
  CreateGroupResponse,
} from 'src/app/dtos';
import { AddAndRemoveUserInput } from 'src/app/dtos/group/addAndRemoveInput.dto';
import { DeleteGroupResponse } from 'src/app/dtos/group/deleteResponse.dto';
import { Group, User } from 'src/app/models';
import { GroupService, UserService } from 'src/app/services';

@Resolver((of) => Group)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}

  @Query((returns) => [Group], { nullable: true })
  async getAllGroups(): Promise<Group[]> {
    return await this.groupService.getAll();
  }

  @ResolveField('members', (returns) => [User])
  async posts(@Parent() group: Group) {
    const ids = group.members.map((item) => {
      return item.id;
    });
    return this.userService.findByIds(ids);
  }

  @Mutation((type) => CreateGroupResponse, { name: 'createGroup' })
  async create(
    @Args('req') req: CreateGroupRequest,
  ): Promise<CreateGroupResponse> {
    return await this.groupService.create(req);
  }

  @Mutation((type) => AddAndRemoveUserResponse, { name: 'deleteUserGroup' })
  async removeUser(
    @Args('req') req: AddAndRemoveUserInput,
  ): Promise<AddAndRemoveUserResponse> {
    return await this.groupService.removeUser(req);
  }

  @Mutation((type) => AddAndRemoveUserResponse, { name: 'addUserGroup' })
  async addUser(
    @Args('req') req: AddAndRemoveUserInput,
  ): Promise<AddAndRemoveUserResponse> {
    return await this.groupService.addUser(req);
  }

  @UseGuards(RoleGroupAuth)
  @Mutation((type) => DeleteGroupResponse, { name: 'deleteGroup' })
  async deleteGroup(
    @Args('req', { type: () => Int }) req: number,
  ): Promise<DeleteGroupResponse> {
    return await this.groupService.delete(req);
  }
}
