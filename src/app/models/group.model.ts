import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from '../shared';
import { User } from './user.model';

@Entity({ name: 'groups' })
@ObjectType()
export class Group extends BaseModel {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field({ nullable: false })
  group_name: string;

  @ManyToMany(() => User, (user) => user.groups, {
    cascade: true,
  })
  @JoinTable()
  members: User[];

  @Column()
  @Field({ nullable: true, defaultValue: null })
  avatar?: string;
}
