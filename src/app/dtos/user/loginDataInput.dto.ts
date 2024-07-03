import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginDataInput {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;
}
