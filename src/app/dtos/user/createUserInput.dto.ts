import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateDataInput {
  @IsEmail()
  @IsNotEmpty()
  @Field({ nullable: false })
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  password: string;
}
