import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateGroupRequest {
  @Field()
  group_name: string;

  @Field()
  avatar?: string;
}
