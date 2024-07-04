import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginDataInput {
  @Field({ nullable: false })
  emailOrUsername: string;

  @Field({ nullable: false })
  password: string;
}
