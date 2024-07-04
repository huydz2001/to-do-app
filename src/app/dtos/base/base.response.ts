import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [GraphQLError], { nullable: true })
  errors: GraphQLError[];
}

@ObjectType()
export class GraphQLError {
  @Field()
  field: string;

  @Field()
  message: string;
}
