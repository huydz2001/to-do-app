import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../shared';
import { User } from './user.entity';

@Entity({ name: 'groups' })
@ObjectType()
export class Group extends BaseModel {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ unique: true, nullable: false })
  @Field()
  group_name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  avatar?: string;

  @OneToMany(() => User, (user) => user.group, {
    cascade: true,
  })
  members: User[];

  constructor(item: Partial<Group>) {
    super();
    Object.assign(this, item);
  }
}
