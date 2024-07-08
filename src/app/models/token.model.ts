import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../shared';

@Entity({ name: 'tokens' })
@ObjectType()
export class Token extends BaseModel {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Field()
  @Column()
  token: string;

  @Field((type) => Int)
  @Column({ unique: true })
  userId: number;

  constructor(item: Partial<Token>) {
    super();
    Object.assign(this, item);
  }
}
