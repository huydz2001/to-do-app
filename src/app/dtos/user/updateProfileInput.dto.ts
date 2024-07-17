import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  dob: string;
}
