import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';

@ObjectType()
export class LogoutResponse extends BaseResponse {
  @Field((type) => Int)
  id: number;

  constructor(item: Partial<LogoutResponse>) {
    super();
    Object.assign(this, item);
  }
}
