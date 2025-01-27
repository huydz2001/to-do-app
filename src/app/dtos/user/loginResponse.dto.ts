import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, GraphQLError } from '../base/base.response';

@ObjectType()
export class LoginResponse extends BaseResponse {
  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;

  constructor(item: Partial<LoginResponse>) {
    super();
    Object.assign(this, item);
  }
}
