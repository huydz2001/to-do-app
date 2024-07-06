import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginDataInput {
  @IsNotEmpty()
  @Field({ nullable: false })
  emailOrUsername: string;

  @IsString()
  @Field({ nullable: false })
  password: string;
}
