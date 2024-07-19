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
import { RoleGroupAuth, TYPE_REQUEST } from 'src/app/common';
import {
  AddAndRemoveUserInput,
  AddAndRemoveUserResponse,
  DeleteGroupResponse,
  UpsertGroupRequest,
  UpsertGroupResponse,
} from 'src/app/dtos';

import { Group, User } from 'src/app/entities';
import { GroupService, UserService } from 'src/app/services';

@Resolver((of) => Group)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}

  @Query((returns) => [Group], { nullable: true, name: 'getAllGroups' })
  async getAllGroups(): Promise<Group[]> {
    return await this.groupService.getAll();
  }

  @Query((returns) => Group, { nullable: true, name: 'getGroupByUser' })
  async getGroupByUser(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Group> {
    return await this.groupService.getByUser(userId);
  }

  @ResolveField('members', (returns) => [User])
  async posts(@Parent() group: Group) {
    return group.members;
  }

  @Mutation((type) => UpsertGroupResponse, { name: 'createGroup' })
  async create(
    @Args('req') req: UpsertGroupRequest,
  ): Promise<UpsertGroupResponse> {
    return await this.groupService.upsert(TYPE_REQUEST.create, req);
  }

  @UseGuards(RoleGroupAuth)
  @Mutation((type) => UpsertGroupResponse, { name: 'updateGroup' })
  async update(
    @Args('req') req: UpsertGroupRequest,
  ): Promise<UpsertGroupResponse> {
    return await this.groupService.upsert(TYPE_REQUEST.update, req);
  }

  @UseGuards(RoleGroupAuth)
  @Mutation((type) => AddAndRemoveUserResponse, { name: 'deleteUserGroup' })
  async removeUser(
    @Args('req') req: AddAndRemoveUserInput,
  ): Promise<AddAndRemoveUserResponse> {
    return await this.groupService.removeUser(req);
  }

  @UseGuards(RoleGroupAuth)
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
