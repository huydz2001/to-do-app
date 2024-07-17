import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/app/entities';

@InputType()
export class UserGroup {
  @Field((type) => Int)
  userId: number;
}

@InputType()
export class UpsertGroupRequest {
  @Field((type) => Int, { nullable: true })
  id: number;

  @Field()
  group_name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field((type) => [Int])
  members: [number];

  @Field((type) => Int)
  create_by: number;
}
