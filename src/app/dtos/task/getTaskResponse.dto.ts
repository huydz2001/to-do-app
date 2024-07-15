import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';
import { Task } from 'src/app/entities';

@ObjectType()
export class GetTaskResponse extends BaseResponse {
  @Field((type) => [Task], { nullable: true })
  tasks: Task[];

  constructor(item: Partial<GetTaskResponse>) {
    super();
    Object.assign(this, item);
  }
}
