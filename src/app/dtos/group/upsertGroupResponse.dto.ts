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
export class UpsertGroupResponse extends BaseResponse {
  @Field({ nullable: true })
  group: GroupResponse;

  constructor(item: Partial<UpsertGroupResponse>) {
    super();
    Object.assign(this, item);
  }
}
