import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';

@ObjectType()
export class TaskResponse {
  @Field((type) => Int)
  id: number;

  @Field()
  task_name: string;
}

@ObjectType()
export class ActionTaskResponse extends BaseResponse {
  @Field((type) => TaskResponse, { nullable: true })
  task?: TaskResponse;

  constructor(item: Partial<ActionTaskResponse>) {
    super();
    Object.assign(this, item);
  }
}
