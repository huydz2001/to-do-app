import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDataInput {
  @Field({ nullable: false })
  email: string;

  @Field()
  user_name: string;

  @Field({ nullable: false })
  password: string;
}
