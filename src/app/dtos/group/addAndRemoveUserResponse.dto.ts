import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';

@ObjectType()
export class AddRemoveUser {
  @Field()
  id: number;

  @Field()
  user_name: string;
}

@ObjectType()
export class AddAndRemoveUserResponse extends BaseResponse {
  @Field({ nullable: true })
  groupId: number;

  @Field((type) => AddRemoveUser, { nullable: true })
  user: AddRemoveUser;

  constructor(item: Partial<AddAndRemoveUserResponse>) {
    super();
    Object.assign(this, item);
  }
}
