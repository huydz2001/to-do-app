import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/app/models';

@InputType()
export class UserGroup {
  @Field((type) => Int)
  userId: number;
}

@InputType()
export class CreateGroupRequest {
  @Field()
  group_name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field((type) => [Int])
  members: [number];
}
