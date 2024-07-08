import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';

@ObjectType()
export class RefreshTokenResponse extends BaseResponse {
  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;

  constructor(item: Partial<RefreshTokenResponse>) {
    super();
    Object.assign(this, item);
  }
}
