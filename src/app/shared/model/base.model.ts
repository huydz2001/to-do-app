import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class BaseModel {
  @Column()
  @Field({ defaultValue: false, nullable: false })
  isDelete: boolean;

  @Column()
  @Field({ defaultValue: null, nullable: false })
  created_at: Date;

  @Column()
  @Field((type) => Int, { defaultValue: null, nullable: false })
  created_by: number;

  @Column()
  @Field({ defaultValue: null, nullable: false })
  updated_at: Date;

  @Column()
  @Field((type) => Int, { defaultValue: null, nullable: false })
  updated_by: number;
}
