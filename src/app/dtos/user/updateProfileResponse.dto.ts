import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';

@ObjectType()
export class UpdateProfileResponse extends BaseResponse {
  @Field((type) => Int)
  id: number;

  constructor(item: Partial<UpdateProfileResponse>) {
    super();
    Object.assign(this, item);
  }
}
