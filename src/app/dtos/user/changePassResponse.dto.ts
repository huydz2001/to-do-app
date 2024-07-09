import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';

@ObjectType()
export class ChangePassResponse extends BaseResponse {
  @Field((type) => Int)
  id: number;

  constructor(item: Partial<ChangePassResponse>) {
    super();
    Object.assign(this, item);
  }
}
