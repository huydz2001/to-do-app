import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';

@ObjectType()
export class GroupDelete {
  @Field((type) => Int, { nullable: true })
  id: number;

  @Field({ nullable: true })
  group_name: string;
}

@ObjectType()
export class DeleteGroupResponse extends BaseResponse {
  @Field((type) => GroupDelete, { nullable: true })
  group: GroupDelete;

  constructor(item: Partial<DeleteGroupResponse>) {
    super();
    Object.assign(this, item);
  }
}
