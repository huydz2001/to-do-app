import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ChangePassInput {
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  oldPass: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  newPass: string;
}
