import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpsertTaskInput {
  @Field((type) => Int, { nullable: true })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  start_date: string;

  @IsNotEmpty()
  @Field()
  start_time: Date;

  @IsNotEmpty()
  @Field()
  end_time: Date;

  @IsString()
  @MaxLength(100)
  @Field({ nullable: true })
  desc?: string;

  @Field((type) => Int, { nullable: true })
  status?: number;

  @Field((type) => Int)
  createBy: number;

  @Field((type) => Int)
  userId: number;
}
