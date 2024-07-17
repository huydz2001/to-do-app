import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '../base/base.response';
import { Task } from 'src/app/entities';

@ObjectType()
export class GetTaskResponse extends BaseResponse {
  @Field((type) => [Task], { nullable: true })
  tasks: Task[];

  @Field((type) => Int)
  total: number;

  @Field((type) => Int)
  currentPage: number;

  @Field((type) => Int, { nullable: true })
  nextPage: number;

  @Field((type) => Int, { nullable: true })
  prevPage: number;

  @Field((type) => Int, { nullable: true })
  lastPage: number;

  constructor(item: Partial<GetTaskResponse>) {
    super();
    Object.assign(this, item);
  }
}
