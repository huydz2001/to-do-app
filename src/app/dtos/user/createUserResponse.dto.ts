import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserResponse {
  @Field()
  id: number;

  @Field()
  user_name: string;

  @Field()
  email: string;

  constructor(id: number, user_name: string, email: string) {
    this.id = id;
    this.email = email;
    this.user_name = user_name;
  }
}
