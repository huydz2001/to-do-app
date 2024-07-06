import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddAndRemoveUserInput {
  @Field((type) => Int)
  groupId: number;

  @Field((type) => Int)
  userId: number;
}
