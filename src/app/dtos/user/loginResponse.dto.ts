import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
