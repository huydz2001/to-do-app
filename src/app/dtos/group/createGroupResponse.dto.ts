import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, GraphQLError } from '../base/base.response';

@ObjectType()
export class GroupResponse {
  @Field()
  id: number;

  @Field()
  group_name: string;
}

@ObjectType()
export class CreateGroupResponse extends BaseResponse {
  @Field()
  group: GroupResponse;

  constructor(item: Partial<CreateGroupResponse>) {
    super();
    Object.assign(this, item);
  }
}
