import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString } from 'class-validator';
import { PaginationInput, SortInput } from '../base';
import * as dayjs from 'dayjs';

@InputType()
export class TaskFillterInput {
  @Field({ nullable: true })
  time: string;

  @Field(() => Int, { nullable: true })
  createBy: number;

  @Field({
    nullable: true,
  })
  date: string;

  @Field(() => Int, { nullable: true })
  status: number;

  @Field({ nullable: true })
  search: string;

  @Field(() => PaginationInput, { nullable: false })
  pagination: PaginationInput;

  @Field(() => SortInput, { nullable: true })
  sort?: SortInput;
}
