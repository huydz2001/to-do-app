import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, GraphQLError } from '../base/base.response';

@ObjectType()
export class LoginResponse extends BaseResponse {
  @Field({ nullable: true })
  accessToken: string;

  constructor(
    code: number,
    success: boolean,
    message: string,
    errors: GraphQLError[],
    accesstoken?: string,
  ) {
    super();
    this.code = code;
    this.success = success;
    this.message = message;
    this.errors = errors;
    this.accessToken = accesstoken;
  }
}
