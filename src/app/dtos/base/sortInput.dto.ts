import { Field, InputType } from '@nestjs/graphql';
import { SORT_DIRECTION } from 'src/app/common';

@InputType()
export class SortInput {
  @Field(() => String)
  field: string;

  @Field(() => String, { defaultValue: SORT_DIRECTION.ASC })
  direction: string;
}
