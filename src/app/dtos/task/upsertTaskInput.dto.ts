import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpsertTaskInput {
  @Field((type) => Int, { nullable: true })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  task_name: string;

  @IsNotEmpty()
  @Field()
  start_date: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  end_time: string;

  @IsString()
  @MaxLength(100)
  @Field({ nullable: true })
  desc?: string;

  @Field((type) => Int, { nullable: true })
  status?: number;

  @Field((type) => Int)
  userId: number;
}
