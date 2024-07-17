import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: false, defaultValue: 1 })
  page: number;

  @Field(() => Int, { nullable: false, defaultValue: 10 })
  limit: number;
}
