import { Field } from '@nestjs/graphql';

export class LoginDataInput {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;
}
