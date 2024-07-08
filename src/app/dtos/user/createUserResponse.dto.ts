import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, GraphQLError } from '../base/base.response';
import { User } from 'src/app/models';

@ObjectType()
export class UserResponse {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;
}

@ObjectType()
export class CreateUserResponse extends BaseResponse {
  @Field(() => UserResponse, { nullable: true })
  user?: UserResponse;

  constructor(item: Partial<CreateUserResponse>) {
    super();
    Object.assign(this, item);
  }
}
