import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class BaseModel {
  @Column()
  @Field({ defaultValue: false, nullable: false })
  isDelete: boolean;

  @Column({
    type: 'timestamp without time zone',
  })
  @Field({ defaultValue: null, nullable: false })
  created_at: Date;

  @Column({
    type: 'timestamp without time zone',
  })
  @Field({ defaultValue: null, nullable: false })
  updated_at: Date;
}
