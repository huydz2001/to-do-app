import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class PaginationInput {
  @IsInt()
  @Field(() => Int, { nullable: false, defaultValue: 1 })
  page: number;

  @IsInt()
  @Field(() => Int, { nullable: false, defaultValue: 10 })
  limit: number;
}
